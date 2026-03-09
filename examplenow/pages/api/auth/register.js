import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { nama, email, password, role } = req.body;

  if (!nama || !email || !password) {
    return res.status(400).json({ message: "Semua field wajib diisi" });
  }

  const allowedRoles = ["admin", "guru", "siswa"];
  if (role && !allowedRoles.includes(role)) {
    return res.status(400).json({ message: "Role tidak valid" });
  }

  try {
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "minggu7",
    });

    const [checkUser] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (checkUser.length > 0) {
      return res.status(400).json({ message: "Email sudah digunakan" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      "INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)",
      [nama, email, hashedPassword, role || "siswa"]
    );

    return res.status(201).json({
      message: "Register berhasil",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
}
