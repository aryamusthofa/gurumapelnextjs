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
           u.id,
           u.nama,
           u.nis_nip,
           u.email,
           u.created_at,
           GROUP_CONCAT(m.id) as mapel_ids,
           GROUP_CONCAT(m.nama_mapel SEPARATOR ', ') as daftar_mapel
         FROM users u
         LEFT JOIN guru_mapel gm ON u.id = gm.guru_id
         LEFT JOIN mapel m ON gm.mapel_id = m.id
         WHERE u.role = 'guru'
         GROUP BY u.id
         ORDER BY u.id ASC`
      );

      const guruWithMapel = rows.map(r => ({
        ...r,
        mapel_ids: r.mapel_ids ? r.mapel_ids.split(',').map(Number) : [],
      }));

      return res.status(200).json({ guru: guruWithMapel });
    }

    if (req.method === "POST") {
      const { nama, email, nis_nip, mapel_ids } = req.body;

      if (!nama || !email || !nis_nip) {
        return res.status(400).json({
          message: "Nama, email, dan NIP wajib diisi",
        });
      }

      const cleanEmail = email.toLowerCase();
      const cleanNisNip = nis_nip.replace(/[^0-9]/g, "");

      const [existingEmail] = await db.execute(
        "SELECT id FROM users WHERE email = ?",
        [cleanEmail]
      );

      if (existingEmail.length > 0) {
        return res.status(400).json({
          message: "Email sudah terdaftar",
        });
      }

      await db.beginTransaction();
      try {
        const hashedPassword = await bcrypt.hash(cleanNisNip, 10);

        const [userResult] = await db.execute(
          `INSERT INTO users (nama, nis_nip, email, password, role)
           VALUES (?, ?, ?, ?, 'guru')`,
          [nama, cleanNisNip, cleanEmail, hashedPassword]
        );

        const guruId = userResult.insertId;

        if (mapel_ids && Array.isArray(mapel_ids) && mapel_ids.length > 0) {
          const values = mapel_ids.map(mId => [guruId, mId]);
          await db.query(
            "INSERT INTO guru_mapel (guru_id, mapel_id) VALUES ?",
            [values]
          );
        }

        await db.commit();

        return res.status(201).json({
          message: "Guru berhasil ditambahkan",
          info: "Password awal menggunakan NIP",
        });
      } catch (err) {
        await db.rollback();
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({
            message: "Email atau NIP sudah digunakan",
          });
        }
        throw err;
      }
    }

    return res.status(405).json({ message: "Method tidak diizinkan" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  } finally {
    await db.end();
  }
}
