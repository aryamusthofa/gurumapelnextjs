import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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
      const [rows] = await db.execute(
        `SELECT 
          u.id, 
          u.nama, 
          u.nis_nip, 
          u.email, 
          u.angkatan,
          u.kelas_id,
          k.nama_kelas,
          k.jurusan_id, 
          j.nama_jurusan,
          u.created_at
         FROM users u
         LEFT JOIN kelas k ON u.kelas_id = k.id
         LEFT JOIN jurusan j ON k.jurusan_id = j.id
         WHERE u.role = 'siswa'
         ORDER BY u.id ASC`
      );

      return res.status(200).json({ siswa: rows });
    }

    if (req.method === "POST") {
      const { nama, email, nis_nip, angkatan, kelas_id } = req.body;

      if (!nama || !email || !nis_nip) {
        return res.status(400).json({
          message: "Nama, email, dan NIS wajib diisi",
        });
      }

      const hashedPassword = await bcrypt.hash(nis_nip, 10);

      try {
        await db.execute(
          `INSERT INTO users (nama, nis_nip, email, password, role, angkatan, kelas_id, created_at, updated_at)
           VALUES (?, ?, ?, ?, 'siswa', ?, ?, NOW(), NOW())`,
          [nama, nis_nip, email, hashedPassword, angkatan || null, kelas_id || null]
        );
      } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
          if (err.message.includes("unique_nis_nip")) {
            return res.status(400).json({
              message: "NIS sudah terdaftar",
            });
          }

          if (err.message.includes("unique_email")) {
            return res.status(400).json({
              message: "Email sudah terdaftar",
            });
          }

          return res.status(400).json({
            message: "Data duplikat terdeteksi",
          });
        }

        throw err;
      }

      return res.status(201).json({
        message: "Siswa berhasil ditambahkan. Password awal adalah NIS.",
      });
    }

    if (req.method === "PUT") {
      const { id } = req.query;
      const { nama, email, nis_nip, angkatan, kelas_id } = req.body;

      if (!id) {
        return res.status(400).json({ message: "ID siswa tidak ditemukan" });
      }

      if (!nama || !email || !nis_nip) {
        return res.status(400).json({
          message: "Nama, email, dan NIS wajib diisi",
        });
      }

      try {
        const [result] = await db.execute(
          `UPDATE users 
           SET nama = ?, email = ?, nis_nip = ?, angkatan = ?, kelas_id = ?, updated_at = NOW()
           WHERE id = ? AND role = 'siswa'`,
          [nama, email, nis_nip, angkatan || null, kelas_id || null, id]
        );

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Siswa tidak ditemukan" });
        }

        return res.status(200).json({ message: "Siswa berhasil diperbarui" });
      } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
          if (err.message.includes("unique_nis_nip")) {
            return res.status(400).json({
              message: "NIS sudah terdaftar",
            });
          }

          if (err.message.includes("unique_email")) {
            return res.status(400).json({
              message: "Email sudah terdaftar",
            });
          }

          return res.status(400).json({
            message: "Data duplikat terdeteksi",
          });
        }

        throw err;
      }
    }

    if (req.method === "DELETE") {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ message: "ID siswa tidak ditemukan" });
      }

      const [result] = await db.execute(
        "DELETE FROM users WHERE id = ? AND role = 'siswa'",
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Siswa tidak ditemukan" });
      }

      return res.status(200).json({ message: "Siswa berhasil dihapus" });
    }

    return res.status(405).json({ message: "Method tidak diizinkan" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  } finally {
    await db.end();
  }
}