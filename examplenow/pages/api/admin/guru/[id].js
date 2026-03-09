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
    return res.status(401).json({ message: "Token tidak valid" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "ID guru tidak ditemukan" });
  }

  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "minggu7",
  });

  try {
    if (req.method === "PUT") {
      const { nama, email, nis_nip } = req.body;

      if (!nama || !email || !nis_nip) {
        return res.status(400).json({
          message: "Nama, email, dan NIP wajib diisi",
        });
      }

      const [duplicateCheck] = await db.execute(
        `SELECT COUNT(*) as count FROM users WHERE nis_nip = ? AND id != ? AND role = 'guru'`,
        [nis_nip, id]
      );

      if (duplicateCheck[0].count > 0) {
        return res.status(409).json({
          message: "NIP sudah digunakan oleh guru lain"
        });
      }

      const [emailCheck] = await db.execute(
  `SELECT COUNT(*) as count 
   FROM users 
   WHERE email = ? AND id != ? AND role = 'guru'`,
  [email, id]
);

if (emailCheck[0].count > 0) {
  return res.status(409).json({
    message: "Email sudah terdaftar",
    detail: "Gunakan email lain karena email ini sudah digunakan oleh guru lain",
    field: "email"
  });
}

      const [result] = await db.execute(
        `UPDATE users
         SET nama = ?, email = ?, nis_nip = ?
         WHERE id = ? AND role = 'guru'`,
        [nama, email, nis_nip, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Guru tidak ditemukan",
        });
      }

      return res.status(200).json({
        message: "Data guru berhasil diperbarui",
        info: "Perubahan NIP tidak memengaruhi password",
      });
    }

    if (req.method === "DELETE") {
      const [result] = await db.execute(
        `DELETE FROM users
         WHERE id = ? AND role = 'guru'`,
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Guru tidak ditemukan",
        });
      }

      return res.status(200).json({
        message: "Guru berhasil dihapus",
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