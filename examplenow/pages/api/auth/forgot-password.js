import mysql from "mysql2/promise";
import crypto from "crypto";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email wajib diisi" });
    }

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "minggu7",
    });

    const [users] = await db.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "Email tidak ditemukan" });
    }

    // hapus token lama (opsional tapi disarankan)
    await db.execute(
      "DELETE FROM password_resets WHERE email = ?",
      [email]
    );

    const token = crypto.randomBytes(32).toString("hex");
    const expiredAt = new Date(Date.now() + 60 * 60 * 1000); // 1 jam

    await db.execute(
      "INSERT INTO password_resets (email, token, expired_at) VALUES (?, ?, ?)",
      [email, token, expiredAt]
    );

    const resetLink = `${process.env.BASE_URL}/auth/reset-password?token=${token}`;

    // =========================
    // KONFIGURASI GMAIL SMTP
    // =========================
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"CBT System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Password CBT",
      html: `
        <h2>Reset Password</h2>
        <p>Klik tombol di bawah untuk mengganti password:</p>
        <a href="${resetLink}" 
           style="display:inline-block;padding:10px 20px;background:#0070f3;color:white;text-decoration:none;border-radius:5px;">
           Reset Password
        </a>
        <p>Link berlaku 1 jam.</p>
      `,
    });

    return res.status(200).json({
      message: "Link reset password telah dikirim ke email",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
}