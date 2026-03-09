import mysql from "mysql2/promise";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token dan password wajib diisi" });
    }

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "minggu7",
    });

    const [rows] = await db.execute(
      "SELECT email, expired_at FROM password_resets WHERE token = ?",
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "Token tidak valid" });
    }

    const resetData = rows[0];

    if (new Date(resetData.expired_at) < new Date()) {
      return res.status(400).json({ message: "Token sudah kadaluarsa" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.execute(
      "UPDATE users SET password = ? WHERE email = ?",
      [hashedPassword, resetData.email]
    );

    await db.execute(
      "DELETE FROM password_resets WHERE token = ?",
      [token]
    );

    return res.status(200).json({
      message: "Password berhasil diperbarui",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
}