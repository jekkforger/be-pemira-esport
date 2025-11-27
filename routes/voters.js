import express from "express";
import pool from "../config/db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, candidate_id } = req.body;

    // voter_name masuk ke kolom "name"
    await pool.query(
      `
      INSERT INTO voters (name, candidate_id, vote_time)
      VALUES ($1, $2, NOW())
    `,
      [name, candidate_id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("POST /api/voters ERROR:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        voters.name AS voter_name,
        voters.vote_time AS time,
        candidates.name AS candidate_name
      FROM voters
      JOIN candidates ON voters.candidate_id = candidates.id
      ORDER BY voters.vote_time DESC
    `);

    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error("GET /api/voters ERROR:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
