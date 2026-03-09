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
      const { nama, email, nis_nip, mapel_ids } = req.body;

      if (!nama || !email || !nis_nip) {
        return res.status(400).json({
          message: "Nama, email, dan NIP wajib diisi",
        });
      }

      const cleanEmail = email.toLowerCase();
      const cleanNisNip = nis_nip.replace(/[^0-9]/g, "");

      const [existingEmail] = await db.execute(
        "SELECT id FROM users WHERE email = ? AND id != ?",
        [cleanEmail, id]
      );

      if (existingEmail.length > 0) {
        return res.status(400).json({
          message: "Email sudah terdaftar",
        });
      }

      await db.beginTransaction();
      try {
        const [result] = await db.execute(
          `UPDATE users
           SET nama = ?, email = ?, nis_nip = ?
           WHERE id = ? AND role = 'guru'`,
          [nama, cleanEmail, cleanNisNip, id]
        );

        if (result.affectedRows === 0) {
          await db.rollback();
          return res.status(404).json({
            message: "Guru tidak ditemukan",
          });
        }

        // Sinkronisasi Mapel (Hapus lama, Tambah baru)
        await db.execute("DELETE FROM guru_mapel WHERE guru_id = ?", [id]);

        if (mapel_ids && Array.isArray(mapel_ids) && mapel_ids.length > 0) {
          const values = mapel_ids.map(mId => [id, mId]);
          await db.query(
            "INSERT INTO guru_mapel (guru_id, mapel_id) VALUES ?",
            [values]
          );
        }

        await db.commit();

        return res.status(200).json({
          message: "Data guru berhasil diperbarui",
          info: "Perubahan NIP tidak memengaruhi password",
        });
      } catch (err) {
        await db.rollback();
        throw err;
      }
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
