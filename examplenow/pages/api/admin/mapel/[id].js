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
    return res.status(400).json({ message: "ID mapel tidak ditemukan" });
  }

  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "minggu7",
  });

  try {
    if (req.method === "PUT") {
      const { nama_mapel, kode_mapel } = req.body;

      if (!nama_mapel || !kode_mapel) {
        return res.status(400).json({
          message: "Nama mapel dan kode mapel wajib diisi",
        });
      }

      try {
        const [result] = await db.execute(
          `UPDATE mapel
           SET nama_mapel = ?, kode_mapel = ?
           WHERE id = ?`,
          [nama_mapel, kode_mapel, id]
        );

        if (result.affectedRows === 0) {
          return res
            .status(404)
            .json({ message: "Mata pelajaran tidak ditemukan" });
        }
      } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res
            .status(400)
            .json({ message: "Kode mapel sudah digunakan" });
        }
        throw err;
      }

      return res.status(200).json({
        message: "Mata pelajaran berhasil diperbarui",
      });
    }

    if (req.method === "DELETE") {
      const [result] = await db.execute(
        "DELETE FROM mapel WHERE id = ?",
        [id]
      );

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Mata pelajaran tidak ditemukan" });
      }

      return res.status(200).json({
        message: "Mata pelajaran berhasil dihapus",
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
