import mysql from "mysql2/promise";

export default async function handler(req, res) {
    try {
        const db = await mysql.createConnection({ host: "localhost", user: "root", password: "", database: "minggu7" });
        const [rows] = await db.execute("DESCRIBE users");
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
