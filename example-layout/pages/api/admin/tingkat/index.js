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
          nama_tingkat,
          angka_tingkat,
          created_at,
          updated_at
        FROM tingkat
        ORDER BY angka_tingkat ASC
      `);

      return res.status(200).json({ tingkat: rows });
    }

    if (req.method === "POST") {
      const { nama_tingkat, angka_tingkat } = req.body;

      if (!nama_tingkat || !angka_tingkat) {
        return res.status(400).json({
          message: "Nama tingkat dan angka tingkat wajib diisi",
        });
      }

      if (isNaN(angka_tingkat)) {
        return res.status(400).json({
          message: "Angka tingkat harus berupa angka",
        });
      }

      const [existing] = await db.execute(
        `SELECT id FROM tingkat 
     WHERE nama_tingkat = ? OR angka_tingkat = ?`,
        [nama_tingkat, angka_tingkat]
      );

      if (existing.length > 0) {
        return res.status(409).json({
          message: "Nama tingkat atau angka tingkat sudah ada",
        });
      }

      await db.execute(
        `INSERT INTO tingkat (nama_tingkat, angka_tingkat)
     VALUES (?, ?)`,
        [nama_tingkat, angka_tingkat]
      );

      return res.status(201).json({
        message: "Tingkat berhasil ditambahkan",
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
