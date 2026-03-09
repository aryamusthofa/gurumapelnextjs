import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";
import nodemailer from "nodemailer";
import crypto from 'crypto';

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
    const userRole = role || "siswa";

    // Insert user dengan status is_verified = FALSE (default dari DB)
    await db.execute(
      "INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)",
      [nama, email, hashedPassword, userRole]
    );

    // Generate kode OTP 6 digit
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Simpan OTP ke database, berlaku 15 menit
    await db.execute(
      "INSERT INTO email_verifications (email, code, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 15 MINUTE))",
      [email, code]
    );

    // Kirim Email Verifikasi
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
      subject: "Kode Verifikasi Pendaftaran Smart CBT",
      html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
                <div style="background: linear-gradient(to right, #2563eb, #4f46e5); color: white; padding: 30px; text-align: center;">
                    <h1 style="margin: 0; font-style: italic; letter-spacing: -1px;">SMART CBT</h1>
                    <p style="margin: 5px 0 0 0; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; font-weight: bold; opacity: 0.8;">Verifikasi Email</p>
                </div>
                <div style="padding: 30px; background-color: #f8fafc; color: #334155;">
                    <h2 style="margin-top: 0; color: #0f172a;">Halo, ${nama}!</h2>
                    <p style="line-height: 1.6;">Terima kasih telah mendaftar di platform Computer Based Test (CBT). Untuk menyelesaikan proses registrasi dan mengaktifkan akun Anda, silakan gunakan kode verifikasi (OTP) berikut:</p>
                    
                    <div style="background-color: white; padding: 20px; border-radius: 8px; border: 2px dashed #94a3b8; text-align: center; margin: 30px 0;">
                        <span style="font-size: 36px; font-weight: 900; letter-spacing: 5px; color: #0f172a;">${code}</span>
                    </div>

                    <p style="line-height: 1.6; color: #64748b; font-size: 14px;">Kode ini hanya berlaku selama <strong>15 menit</strong>. Jangan bagikan kode ini kepada siapapun.</p>
                </div>
                <div style="text-align: center; padding: 20px; font-size: 12px; color: #94a3b8; background-color: white; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0;">Email ini dikirim secara otomatis. Mohon jangan membalas pesan ini.</p>
                    <p style="margin: 5px 0 0 0;">&copy; ${new Date().getFullYear()} Smart CBT. All rights reserved.</p>
                </div>
            </div>
        `,
    };

    try {
      await transporter.sendMail(mailOptions);

      return res.status(201).json({
        message: "Registrasi berhasil, kode OTP telah dikirim ke email.",
        requireVerification: true,
        email: email
      });
    } catch (emailError) {
      console.error("Gagal mengirim email verifikasi:", emailError);

      // Rollback registrasi: Hapus OTP dan User karena email tidak valid/gagal kirim
      await db.execute("DELETE FROM email_verifications WHERE email = ?", [email]);
      await db.execute("DELETE FROM users WHERE email = ?", [email]);

      return res.status(400).json({
        message: "Gagal mengirim email OTP. Pastikan alamat email valid dan aktif."
      });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
}
