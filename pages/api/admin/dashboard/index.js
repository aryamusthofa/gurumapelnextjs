import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method tidak diizinkan" });
  }

  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ message: "Token tidak valid" });
  }

  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "minggu7",
  });

  try {
    const [
      [guru],
      [siswa],
      [jurusan],
      [kelas],
      [mapel],
      [tingkat],
    ] = await Promise.all([
      db.execute(`SELECT COUNT(*) AS total FROM users WHERE role = 'guru'`),
      db.execute(`SELECT COUNT(*) AS total FROM users WHERE role = 'siswa'`),
      db.execute(`SELECT COUNT(*) AS total FROM jurusan`),
      db.execute(`SELECT COUNT(*) AS total FROM kelas`),
      db.execute(`SELECT COUNT(*) AS total FROM mapel`),
      db.execute(`SELECT COUNT(*) AS total FROM tingkat`),
    ]);

    return res.status(200).json({
      guru: guru[0].total,
      siswa: siswa[0].total,
      jurusan: jurusan[0].total,
      kelas: kelas[0].total,
      mapel: mapel[0].total,
      tingkat: tingkat[0].total,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  } finally {
    await db.end();
  }
}
