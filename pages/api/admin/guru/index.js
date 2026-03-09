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
    return res.status(401).json({ message: "Token tidak valid" });
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
           id,
           nama,
           nis_nip,
           email,
           created_at
         FROM users
         WHERE role = 'guru'
         ORDER BY id ASC`
      );

      return res.status(200).json({ guru: rows });
    }

    if (req.method === "POST") {
      const { nama, email, nis_nip } = req.body;

      if (!nama || !email || !nis_nip) {
        return res.status(400).json({
          message: "Nama, email, dan NIP wajib diisi",
        });
      }

      const hashedPassword = await bcrypt.hash(nis_nip, 10);

      try {
        await db.execute(
          `INSERT INTO users (nama, nis_nip, email, password, role, created_at, updated_at)
           VALUES (?, ?, ?, ?, 'guru', NOW(), NOW())`,
          [nama, nis_nip, email, hashedPassword]
        );
      } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({
            message: "Email atau NIP sudah digunakan",
          });
        }
        throw err;
      }

      return res.status(201).json({
        message: "Guru berhasil ditambahkan",
        info: "Password awal menggunakan NIP",
      });
    }

    return res.status(405).json({ message: "Method tidak diizinkan" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  } finally {
    await db.end();
  }
}
