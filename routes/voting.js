import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// ===============================
// BACKEND STATUS (DATABASE REAL)
// ===============================
router.get("/status", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT is_open, start_time, end_time
      FROM voting_status
      WHERE id = 1
    `);

    const row = result.rows[0];

    res.json({
      voting_open: row.is_open,
      start_time: row.start_time,
      end_time: row.end_time,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// ADMIN OPEN (UPDATE DB)
// ===============================
router.post("/open", async (req, res) => {
  try {
    await pool.query(`
      UPDATE voting_status
      SET is_open = TRUE,
          start_time = NOW(),
          end_time = NULL
      WHERE id = 1
    `);

    res.json({ success: true, message: "Voting dibuka." });
  } catch (err) {
    res.status(500).json({ error: "Gagal membuka voting" });
  }
});

// ===============================
// ADMIN CLOSE (UPDATE DB)
// ===============================
router.post("/close", async (req, res) => {
  try {
    await pool.query(`
      UPDATE voting_status
      SET is_open = FALSE,
          end_time = NOW()
      WHERE id = 1
    `);

    res.json({ success: true, message: "Voting ditutup." });
  } catch (err) {
    res.status(500).json({ error: "Gagal menutup voting" });
  }
});

// ===============================
// RESET DATA (TIDAK DIUBAH)
// ===============================
router.post("/reset", async (req, res) => {
  try {
    await pool.query("TRUNCATE TABLE voters RESTART IDENTITY");
    await pool.query("UPDATE voting_status SET is_open = FALSE, start_time=NULL, end_time=NULL WHERE id=1");

    res.json({ success: true, message: "Voting direset" });
  } catch (err) {
    res.status(500).json({ error: "Gagal mereset voting" });
  }
});

// ===============================
// SIMPAN SUARA PEMILIH
// ===============================
router.post("/vote", async (req, res) => {
  try {
    const { name, candidate_id } = req.body;

    if (!name || !candidate_id) {
      return res.status(400).json({ error: "Data voting tidak lengkap" });
    }

    // Cek apakah voting sudah dibuka
    const status = await pool.query(`
      SELECT is_open FROM voting_status WHERE id = 1
    `);

    if (!status.rows[0].is_open) {
      return res.status(403).json({ error: "Voting belum dibuka" });
    }

    // Simpan data voter
    await pool.query(
      `
        INSERT INTO voters (name, candidate_id, created_at)
        VALUES ($1, $2, NOW())
      `,
      [name, candidate_id]
    );

    res.json({ success: true, message: "Voting berhasil disimpan" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal menyimpan voting" });
  }
});

router.get("/results", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT candidate_id, COUNT(*) AS total
      FROM voters
      GROUP BY candidate_id
    `);

    const data = {};

    result.rows.forEach((r) => {
      data[r.candidate_id] = Number(r.total);
    });

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: "Gagal memuat hasil voting" });
  }
});

router.get("/list", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        v.name AS voter_name,
        v.candidate_id,
        c.nama AS candidate_name,
        v.created_at AS time
      FROM voters v
      LEFT JOIN candidates c ON c.id = v.candidate_id
      ORDER BY v.id DESC
    `);

    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ error: "Gagal memuat daftar pemilih" });
  }
});


export default router;
