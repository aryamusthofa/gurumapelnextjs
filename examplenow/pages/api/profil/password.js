import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { passwordBaru } = req.body;

  if (!passwordBaru) {
    return res.status(400).json({ message: "Password baru wajib diisi" });
  }

  if (passwordBaru.length < 6) {
    return res.status(400).json({ message: "Password baru minimal 6 karakter" });
  }

  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "Token tidak ditemukan" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "minggu7",
    });

    const hashedPassword = await bcrypt.hash(passwordBaru, 10);

    const [result] = await db.execute(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashedPassword, decoded.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    return res.status(200).json({
      message: "Password berhasil diperbarui",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
}
