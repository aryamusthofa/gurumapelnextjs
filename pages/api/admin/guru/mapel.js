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

  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "minggu7",
  });

  try {
    /**
     * GET ?guru_id=1
     * Ambil mapel yang diajar guru
     */
    if (req.method === "GET") {
      const { guru_id } = req.query;

      if (!guru_id) {
        return res.status(400).json({
          message: "ID guru wajib dikirim",
        });
      }

      const [rows] = await db.execute(
        `SELECT 
           m.id,
           m.nama_mapel,
           m.kode_mapel
         FROM guru_mapel gm
         JOIN mapel m ON gm.mapel_id = m.id
         WHERE gm.guru_id = ?`,
        [guru_id]
      );

      return res.status(200).json({
        guru_id,
        mapel: rows,
      });
    }

    /**
     * POST
     * Body:
     * {
     *   "guru_id": 1,
     *   "mapel_ids": [1, 2]
     * }
     */
    if (req.method === "POST") {
      const { guru_id, mapel_ids } = req.body;

      if (!guru_id || !Array.isArray(mapel_ids)) {
        return res.status(400).json({
          message: "guru_id dan mapel_ids wajib diisi",
        });
      }

      // pastikan user adalah guru
      const [guruCheck] = await db.execute(
        `SELECT id FROM users WHERE id = ? AND role = 'guru'`,
        [guru_id]
      );

      if (guruCheck.length === 0) {
        return res.status(404).json({
          message: "Guru tidak ditemukan",
        });
      }

      // hapus mapel lama
      await db.execute(
        `DELETE FROM guru_mapel WHERE guru_id = ?`,
        [guru_id]
      );

      // insert mapel baru
      for (const mapel_id of mapel_ids) {
        await db.execute(
          `INSERT INTO guru_mapel (guru_id, mapel_id)
           VALUES (?, ?)`,
          [guru_id, mapel_id]
        );
      }

      return res.status(200).json({
        message: "Mapel guru berhasil diperbarui",
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
