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

router.get("/status", async (req, res) => {
  try {
    const result = await pool.query("SELECT voting_open FROM status LIMIT 1");

    res.json({
      success: true,
      voting_open: result.rows[0]?.voting_open || false,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
