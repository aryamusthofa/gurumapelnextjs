import mysql from "mysql2/promise";
import crypto from "crypto";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email wajib diisi" });
    }

    try {
        const db = await mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "minggu7",
        });

        // Check if user exists
        const [users] = await db.execute("SELECT id, nama FROM users WHERE email = ?", [email]);
        if (users.length === 0) {
            await db.end();
            return res.status(404).json({ message: "Email tidak terdaftar" });
        }

        const user = users[0];

        // Generate token
        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 3600000); // 1 jam

        // Clean up old tokens
        await db.execute("DELETE FROM password_resets WHERE email = ?", [email]);

        // Store token
        await db.execute(
            "INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)",
            [email, token, expiresAt]
        );

        await db.end();

        // Configure Nodemailer
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false, // true untuk port 465
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const resetLink = `http://localhost:3000/auth/reset-password?token=${token}`;

        // Send Email
        await transporter.sendMail({
            from: `"Admin CBT" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Reset Password - CBT",
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2>Halo, ${user.nama}</h2>
                    <p>Anda menerima email ini karena ada permintaan untuk mereset password akun Anda.</p>
                    <p>Silakan klik tombol di bawah ini untuk mereset password Anda:</p>
                    <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: black; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0;">Reset Password</a>
                    <p>Link ini akan kadaluwarsa dalam 1 jam.</p>
                    <p>Jika Anda tidak merasa melakukan permintaan ini, silakan abaikan email ini.</p>
                    <hr />
                    <p style="font-size: 12px; color: #777;">Admin CBT</p>
                </div>
            `,
        });

        return res.status(200).json({ message: "Link reset password telah dikirim ke email Anda" });
    } catch (error) {
        console.error("Nodemailer Error:", error);
        return res.status(500).json({ message: "Gagal mengirim email. Pastikan konfigurasi SMTP di .env.local sudah benar." });
    }
}
