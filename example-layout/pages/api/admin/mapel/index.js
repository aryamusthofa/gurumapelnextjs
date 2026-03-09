import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ message: "Token tidak valid atau kadaluarsa" });
  }

  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "minggu7",
  });

  try {
    if (req.method === "GET") {
      const [rows] = await db.execute(`
        SELECT 
          id,
          nama_mapel,
          kode_mapel,
          created_at,
          updated_at
        FROM mapel
        ORDER BY id ASC
      `);

      return res.status(200).json({ mapel: rows });
    }

    if (req.method === "POST") {
      const { nama_mapel, kode_mapel } = req.body;

      if (!nama_mapel || !kode_mapel) {
        return res.status(400).json({
          message: "Nama mapel dan kode mapel wajib diisi",
        });
      }

      try {
        await db.execute(
          `INSERT INTO mapel (nama_mapel, kode_mapel)
           VALUES (?, ?)`,
          [nama_mapel, kode_mapel]
        );
      } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res
            .status(400)
            .json({ message: "Kode mapel sudah digunakan" });
        }
        throw err;
      }

      return res.status(201).json({
        message: "Mata pelajaran berhasil ditambahkan",
      });
    }

    return res.status(405).json({ message: "Method tidak diizinkan" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  } finally {
    await db.end();
  }
}
