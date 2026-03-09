import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Token tidak valid atau kadaluarsa" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "ID jurusan tidak ditemukan" });
  }

  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "minggu7",
  });

  try {
    if (req.method === "PUT") {
      const { nama_jurusan, kode_jurusan } = req.body;

      if (!nama_jurusan) {
        return res.status(400).json({ message: "Nama jurusan wajib diisi" });
      }

      if (kode_jurusan) {
        const [existingRows] = await db.execute(
          "SELECT id FROM jurusan WHERE kode_jurusan = ? AND id != ? LIMIT 1",
          [kode_jurusan, id]
        );

        if (existingRows.length > 0) {
          return res.status(400).json({ message: "Kode jurusan sudah digunakan oleh jurusan lain." });
        }
      }


      const [result] = await db.execute(
        "UPDATE jurusan SET nama_jurusan = ?, kode_jurusan = ?, updated_at = NOW() WHERE id = ?",
        [nama_jurusan, kode_jurusan || null, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Jurusan tidak ditemukan" });
      }

      return res.status(200).json({ message: "Jurusan berhasil diperbarui" });
    }

    if (req.method === "DELETE") {
      const [result] = await db.execute("DELETE FROM jurusan WHERE id = ?", [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Jurusan tidak ditemukan" });
      }

      return res.status(200).json({ message: "Jurusan berhasil dihapus" });
    }

    return res.status(405).json({ message: "Method tidak diizinkan" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  } finally {
    await db.end();
  }
}