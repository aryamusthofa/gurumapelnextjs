import mysql from "mysql2/promise";
import nodemailer from "nodemailer";
import crypto from 'crypto';

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

        // Pastikan user ada dan belum diverifikasi
        const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
        if (users.length === 0) {
            return res.status(404).json({ message: "Email tidak terdaftar" });
        }

        if (users[0].is_verified) {
            return res.status(400).json({ message: "Email sudah diverifikasi sebelumnya" });
        }

        // Rate Limiting: Cek apakah sudah minta dalam 1 menit terakhir
        const [recentRequests] = await db.execute(
            "SELECT created_at FROM email_verifications WHERE email = ? AND created_at > DATE_SUB(NOW(), INTERVAL 1 MINUTE) ORDER BY created_at DESC LIMIT 1",
            [email]
        );

        if (recentRequests.length > 0) {
            return res.status(429).json({ message: "Mohon tunggu 1 menit sebelum meminta kode baru" });
        }

        // Generate OTP (6 angka)
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Setup Kirim Email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"Smart CBT Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Kode Verifikasi Email CBT",
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
                <div style="background: linear-gradient(to right, #2563eb, #4f46e5); color: white; padding: 30px; text-align: center;">
                    <h1 style="margin: 0; font-style: italic; letter-spacing: -1px;">SMART CBT</h1>
                    <p style="margin: 5px 0 0 0; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; font-weight: bold; opacity: 0.8;">Verifikasi Akun</p>
                </div>
                <div style="padding: 30px; background-color: #f8fafc; color: #334155;">
                    <h2 style="margin-top: 0; color: #0f172a;">Kode Verifikasi Anda</h2>
                    <p style="line-height: 1.6;">Gunakan kode OTP berikut untuk memverifikasi akun Anda. Kode ini hanya berlaku selama <strong>15 menit</strong>.</p>
                    
                    <div style="background-color: white; padding: 20px; border-radius: 8px; border: 2px dashed #94a3b8; text-align: center; margin: 30px 0;">
                        <span style="font-size: 36px; font-weight: 900; letter-spacing: 5px; color: #0f172a;">${code}</span>
                    </div>

                    <p style="line-height: 1.6; color: #64748b; font-size: 14px;">Jika Anda tidak mendaftar di Smart CBT, abaikan email ini.</p>
                </div>
                <div style="text-align: center; padding: 20px; font-size: 12px; color: #94a3b8; background-color: white; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0;">Email otomatis. Jangan membalas.</p>
                </div>
            </div>
        `,
        };

        try {
            await transporter.sendMail(mailOptions);

            // Simpan kode baru ke DB (berlaku 15 menit) HANYA JIKA email berhasil terkirim
            await db.execute(
                "INSERT INTO email_verifications (email, code, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 15 MINUTE))",
                [email, code]
            );

            return res.status(200).json({ message: "Kode OTP baru telah dikirim ke email Anda" });
        } catch (emailError) {
            console.error("Gagal mengirim email resend OTP:", emailError);
            return res.status(500).json({ message: "Gagal mengirim email OTP. Pastikan email Anda valid dan aktif." });
        }

    } catch (error) {
        console.error("Resend Code Error:", error);
        return res.status(500).json({ message: "Terjadi kesalahan. Silakan coba lagi nanti." });
    }
}
