import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ message: "Token tidak valid atau kadaluarsa" });
  }

  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "minggu7",
  });

  try {
    if (req.method === "GET") {
      if (req.query.dropdown === "true") {
        const [rows] = await db.execute(`
          SELECT 
            id,
            nama_kelas,
            jurusan_id
          FROM kelas
          ORDER BY nama_kelas ASC
        `);

        return res.status(200).json({ kelas: rows });
      }

      if (req.query.options === "true") {
        const [tingkat] = await db.execute(
          "SELECT id, nama_tingkat FROM tingkat ORDER BY id ASC"
        );

        const [guru] = await db.execute(
          "SELECT id, nama FROM users WHERE role = 'guru' ORDER BY nama ASC"
        );

        return res.status(200).json({ tingkat, guru });
      }

      const [rows] = await db.execute(`
        SELECT 
          kelas.id,
          kelas.nama_kelas,
          jurusan.id AS jurusan_id,
          jurusan.nama_jurusan,
          tingkat.id AS tingkat_id,
          tingkat.nama_tingkat,
          tingkat.angka_tingkat,
          users.id AS wali_kelas_id,
          users.nama AS wali_kelas
        FROM kelas
        JOIN jurusan ON kelas.jurusan_id = jurusan.id
        JOIN tingkat ON kelas.tingkat_id = tingkat.id
        LEFT JOIN users ON kelas.wali_kelas_id = users.id
        ORDER BY kelas.id ASC
      `);

      return res.status(200).json({ kelas: rows });
    }

    if (req.method === "POST") {
      const { nama_kelas, jurusan_id, tingkat_id, wali_kelas_id } = req.body;

      if (!nama_kelas || !jurusan_id || !tingkat_id) {
        return res.status(400).json({
          message: "Nama kelas, jurusan, dan tingkat wajib diisi",
        });
      }

      // MODIFIKASI: Cek apakah nama_kelas sudah ada
      // Menggunakan LOWER() untuk membuat pengecekan tidak case-sensitive (misal: "XII RPL" sama dengan "xii rpl")
      const [existingKelas] = await db.execute(
        "SELECT id FROM kelas WHERE LOWER(nama_kelas) = LOWER(?)",
        [nama_kelas]
      );

      if (existingKelas.length > 0) {
        return res.status(400).json({
          message: "Nama kelas sudah digunakan, silakan gunakan nama lain.",
        });
      }

      if (wali_kelas_id) {
        const [[guru]] = await db.execute(
          "SELECT id FROM users WHERE id = ? AND role = 'guru'",
          [wali_kelas_id]
        );

        if (!guru) {
          return res.status(400).json({
            message: "Wali kelas harus berasal dari user dengan role guru",
          });
        }
      }

      await db.execute(
        `INSERT INTO kelas 
          (nama_kelas, jurusan_id, tingkat_id, wali_kelas_id)
         VALUES (?, ?, ?, ?)`,
        [nama_kelas, jurusan_id, tingkat_id, wali_kelas_id || null]
      );

      return res.status(201).json({
        message: "Kelas berhasil ditambahkan",
      });
    }

    // Tambahkan logika untuk method PUT jika perlu validasi yang sama saat update
    if (req.method === "PUT") {
        const { id } = req.query;
        const { nama_kelas, jurusan_id, tingkat_id, wali_kelas_id } = req.body;
    
        if (!nama_kelas || !jurusan_id || !tingkat_id) {
          return res.status(400).json({
            message: "Nama kelas, jurusan, dan tingkat wajib diisi",
          });
        }
    
        // MODIFIKASI: Cek duplikat, tapi kecualikan kelas yang sedang diedit
        const [existingKelas] = await db.execute(
          "SELECT id FROM kelas WHERE LOWER(nama_kelas) = LOWER(?) AND id != ?",
          [nama_kelas, id]
        );
    
        if (existingKelas.length > 0) {
          return res.status(400).json({
            message: "Nama kelas sudah digunakan, silakan gunakan nama lain.",
          });
        }
    
        // ... (logika update lainnya) ...
        // Anda bisa menambahkan logika update lengkap di sini jika belum ada
        await db.execute(
          `UPDATE kelas 
           SET nama_kelas = ?, jurusan_id = ?, tingkat_id = ?, wali_kelas_id = ?
           WHERE id = ?`,
          [nama_kelas, jurusan_id, tingkat_id, wali_kelas_id || null, id]
        );
    
        return res.status(200).json({ message: "Kelas berhasil diperbarui" });
    }


    return res.status(405).json({ message: "Method tidak diizinkan" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  } finally {
    await db.end();
  }
}