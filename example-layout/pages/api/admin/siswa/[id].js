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
    return res.status(400).json({ message: "ID siswa tidak ditemukan" });
  }

  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "minggu7",
  });

  try {
    if (req.method === "PUT") {
      const { nama, email, nis_nip, angkatan, kelas_id } = req.body;

      if (!nama || !email || !nis_nip || !angkatan || !kelas_id) {
        return res.status(400).json({
          message: "Nama, email, NIS, angkatan, dan kelas wajib diisi",
        });
      }

      const [kelas] = await db.execute(
        "SELECT id FROM kelas WHERE id = ?",
        [kelas_id]
      );

      if (kelas.length === 0) {
        return res.status(400).json({
          message: "Kelas tidak ditemukan",
        });
      }

      try {
        const [result] = await db.execute(
          `UPDATE users
           SET 
             nama = ?, 
             email = ?, 
             nis_nip = ?, 
             angkatan = ?, 
             kelas_id = ?
           WHERE id = ? AND role = 'siswa'`,
          [nama, email, nis_nip, angkatan, kelas_id, id]
        );

        if (result.affectedRows === 0) {
          return res.status(404).json({
            message: "Siswa tidak ditemukan",
          });
        }
      } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
          if (err.message.includes("unique_nis_nip")) {
            return res.status(400).json({
              message: "NIS sudah digunakan oleh siswa lain",
            });
          }

          if (err.message.includes("unique_email")) {
            return res.status(400).json({
              message: "Email sudah digunakan oleh pengguna lain",
            });
          }

          return res.status(400).json({
            message: "Data duplikat terdeteksi",
          });
        }

        throw err;
      }

      return res.status(200).json({
        message: "Data siswa berhasil diperbarui",
      });
    }

    if (req.method === "DELETE") {
      const [result] = await db.execute(
        `DELETE FROM users WHERE id = ? AND role = 'siswa'`,
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Siswa tidak ditemukan",
        });
      }

      return res.status(200).json({
        message: "Siswa berhasil dihapus",
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
