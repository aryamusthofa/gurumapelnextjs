import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password wajib diisi" });
  }

  try {
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "minggu7", 
    });

    const [rows] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "Email tidak ditemukan" });
    }

    const user = rows[0];

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ message: "Password salah" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.setHeader("Set-Cookie", `token=${token}; Path=/; HttpOnly; Max-Age=86400; SameSite=Lax`);

    return res.status(200).json({
      message: "Login berhasil",
      role: user.role,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
}
