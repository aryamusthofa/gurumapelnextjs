import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { nama, email } = req.body;

  if (!nama || !email) {
    return res.status(400).json({ message: "Nama dan email wajib diisi" });
  }

  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "Token tidak ditemukan" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "minggu7",
    });

    await db.execute(
      "UPDATE users SET nama = ?, email = ? WHERE id = ?",
      [nama, email, decoded.id]
    );

    return res.status(200).json({
      message: "Profil berhasil diperbarui",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
}
