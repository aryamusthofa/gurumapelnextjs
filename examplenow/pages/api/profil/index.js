import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
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

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "minggu7",
    });

    const [rows] = await db.execute(
      "SELECT nama, email, role FROM users WHERE id = ?",
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    return res.status(200).json({
      user: rows[0],
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
}
