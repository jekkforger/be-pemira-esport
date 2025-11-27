import express from "express";
import { db } from "../db.js";

const router = express.Router();

// SUBMIT VOTE
router.post("/", async (req, res) => {
  const { voter_name, candidate_id } = req.body;

  // cek double vote
  const exists = await db.query(
    "SELECT * FROM voters WHERE voter_name = $1",
    [voter_name]
  );

  if (exists.rowCount > 0) {
    return res.json({ success: false, message: "Kamu sudah memilih!" });
  }

  await db.query(
    "INSERT INTO voters (voter_name, candidate_id, time) VALUES ($1, $2, NOW())",
    [voter_name, candidate_id]
  );

  res.json({ success: true, message: "Vote tersimpan" });
});

// GET VOTERS LIST
router.get("/", async (req, res) => {
  const result = await db.query(`
    SELECT voters.*, candidates.name AS candidate_name
    FROM voters
    LEFT JOIN candidates ON candidates.id = voters.candidate_id
    ORDER BY time DESC
  `);

  res.json({ success: true, data: result.rows });
});

// SUMMARY
router.get("/summary", async (req, res) => {
  const result = await db.query(`
    SELECT candidates.id, candidates.name, COUNT(voters.candidate_id) AS votes
    FROM candidates
    LEFT JOIN voters ON candidates.id = voters.candidate_id
    GROUP BY candidates.id
    ORDER BY candidates.id ASC
  `);

  res.json({ success: true, data: result.rows });
});

export default router;
