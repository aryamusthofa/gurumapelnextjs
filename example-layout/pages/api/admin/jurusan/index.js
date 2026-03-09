import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
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
      const [rows] = await db.execute("SELECT * FROM jurusan ORDER BY id ASC");
      return res.status(200).json({ jurusan: rows });
    }

    if (req.method === "POST") {
      const { nama_jurusan, kode_jurusan } = req.body;

      if (!nama_jurusan) {
        return res.status(400).json({ message: "Nama jurusan wajib diisi" });
      }

      if (kode_jurusan) {
        const [existingRows] = await db.execute(
          "SELECT id FROM jurusan WHERE kode_jurusan = ? LIMIT 1",
          [kode_jurusan]
        );

        if (existingRows.length > 0) {
          return res.status(400).json({ message: "Kode jurusan sudah digunakan, silakan gunakan kode lain." });
        }
      }

      const [result] = await db.execute(
        "INSERT INTO jurusan (nama_jurusan, kode_jurusan) VALUES (?, ?)",
        [nama_jurusan, kode_jurusan || null]
      );

      return res.status(201).json({
        message: "Jurusan berhasil ditambahkan",
        id: result.insertId,
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