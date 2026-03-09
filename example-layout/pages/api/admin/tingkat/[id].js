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

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "ID tingkat tidak ditemukan" });
  }

  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "minggu7",
  });

  try {
    if (req.method === "PUT") {
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
     WHERE (nama_tingkat = ? OR angka_tingkat = ?)
     AND id != ?`,
        [nama_tingkat, angka_tingkat, id]
      );

      if (existing.length > 0) {
        return res.status(409).json({
          message: "Nama tingkat atau angka tingkat sudah digunakan",
        });
      }

      const [result] = await db.execute(
        `UPDATE tingkat
     SET 
       nama_tingkat = ?,
       angka_tingkat = ?
     WHERE id = ?`,
        [nama_tingkat, angka_tingkat, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Tingkat tidak ditemukan" });
      }

      return res.status(200).json({
        message: "Tingkat berhasil diperbarui",
      });
    }


    if (req.method === "DELETE") {
      const [result] = await db.execute(
        "DELETE FROM tingkat WHERE id = ?",
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Tingkat tidak ditemukan" });
      }

      return res.status(200).json({
        message: "Tingkat berhasil dihapus",
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
