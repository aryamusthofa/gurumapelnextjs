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
    return res.status(400).json({ message: "ID kelas tidak ditemukan" });
  }

  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "minggu7",
  });

  try {
    if (req.method === "PUT") {
      const { nama_kelas, jurusan_id, tingkat_id, wali_kelas_id } = req.body;

      if (!nama_kelas || !jurusan_id || !tingkat_id) {
        return res.status(400).json({
          message: "Nama kelas, jurusan, dan tingkat wajib diisi",
        });
      }

      // MODIFIKASI: Cek apakah nama_kelas sudah ada di kelas lain sebelum update
      // Kita menggunakan LOWER() untuk pencarian tidak case-sensitive
      // Dan `id != ?` untuk mengecualikan kelas yang sedang diedit itu sendiri
      const [existingKelas] = await db.execute(
        "SELECT id FROM kelas WHERE LOWER(nama_kelas) = LOWER(?) AND id != ?",
        [nama_kelas, id]
      );

      if (existingKelas.length > 0) {
        // Menggunakan status 409 (Conflict) karena ada konflik data
        return res.status(409).json({
          message: "Nama kelas sudah digunakan oleh kelas lain. Silakan gunakan nama lain.",
        });
      }

      if (wali_kelas_id) {
        const [[guru]] = await db.execute(
          "SELECT id FROM users WHERE id = ? AND role = 'guru'",
          [wali_kelas_id]
        );

        if (!guru) {
          return res.status(400).json({
            message: "Wali kelas harus berasal dari user dengan role guru",
          });
        }

        // MODIFIKASI: Cek apakah guru ini sudah menjadi wali kelas di kelas lain
        const [existingWali] = await db.execute(
          "SELECT nama_kelas FROM kelas WHERE wali_kelas_id = ? AND id != ?",
          [wali_kelas_id, id]
        );

        if (existingWali.length > 0) {
          return res.status(400).json({
            message: `Guru tersebut sudah menjadi wali kelas di kelas ${existingWali[0].nama_kelas}. Silakan pilih guru lain.`,
          });
        }
      }



      const [result] = await db.execute(
        `UPDATE kelas
         SET 
           nama_kelas = ?,
           jurusan_id = ?,
           tingkat_id = ?,
           wali_kelas_id = ?
         WHERE id = ?`,
        [
          nama_kelas,
          jurusan_id,
          tingkat_id,
          wali_kelas_id || null,
          id,
        ]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Kelas tidak ditemukan",
        });
      }

      return res.status(200).json({
        message: "Kelas berhasil diperbarui",
      });
    }

    if (req.method === "DELETE") {
      const [result] = await db.execute(
        "DELETE FROM kelas WHERE id = ?",
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Kelas tidak ditemukan",
        });
      }

      return res.status(200).json({
        message: "Kelas berhasil dihapus",
      });
    }

    return res.status(405).json({ message: "Method tidak diizinkan" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Terjadi kesalahan server",
    });
  } finally {
    await db.end();
  }
}