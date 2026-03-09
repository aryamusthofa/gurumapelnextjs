import mysql from "mysql2/promise";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ message: "Email dan kode OTP wajib diisi" });
    }

    try {
        const db = await mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "minggu7",
        });

        // Cek kode verifikasi
        const [verifications] = await db.execute(
            "SELECT * FROM email_verifications WHERE email = ? AND code = ? AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1",
            [email, code]
        );

        if (verifications.length === 0) {
            return res.status(400).json({ message: "Kode OTP tidak valid atau sudah kadaluwarsa" });
        }

        // Update status user jadi verified
        const [updateResult] = await db.execute(
            "UPDATE users SET is_verified = TRUE WHERE email = ?",
            [email]
        );

        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        // Hapus kode agar tidak bisa dipakai lagi (opsional tapi best practice)
        await db.execute("DELETE FROM email_verifications WHERE email = ?", [email]);

        return res.status(200).json({ message: "Email berhasil diverifikasi" });

    } catch (error) {
        console.error("Verify Email Error:", error);
        return res.status(500).json({ message: "Terjadi kesalahan server" });
    }
}
