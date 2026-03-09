import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { token, password } = req.body;

    if (!token || !password) {
        return res.status(400).json({ message: "Token dan password wajib diisi" });
    }

    try {
        const db = await mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "minggu7",
        });

        // Verify token
        const [resets] = await db.execute(
            "SELECT * FROM password_resets WHERE token = ? AND expires_at > NOW()",
            [token]
        );

        if (resets.length === 0) {
            await db.end();
            return res.status(400).json({ message: "Token tidak valid atau sudah kedaluwarsa" });
        }

        const resetRequest = resets[0];
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user password
        await db.execute(
            "UPDATE users SET password = ? WHERE email = ?",
            [hashedPassword, resetRequest.email]
        );

        // Delete the used token
        await db.execute("DELETE FROM password_resets WHERE id = ?", [resetRequest.id]);

        await db.end();

        return res.status(200).json({ message: "Password berhasil diperbarui" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Terjadi kesalahan server" });
    }
}
