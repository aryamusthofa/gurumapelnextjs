import mysql from "mysql2/promise";

export default async function handler(req, res) {
    try {
        const db = await mysql.createConnection({ host: "localhost", user: "root", password: "", database: "minggu7" });
        await db.execute("ALTER TABLE users ADD COLUMN foto LONGTEXT NULL AFTER email");
        res.status(200).json({ status: "success" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
