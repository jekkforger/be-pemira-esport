import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";

import adminRoutes from "./routes/admin.js";
import votingRoutes from "./routes/voting.js";
import candidateRoutes from "./routes/candidates.js";
import voterRoutes from "./routes/voters.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// REGISTER ROUTES
app.use("/api/admin", adminRoutes);
app.use("/api/voting", votingRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/voters", voterRoutes);

// ❌ HAPUS yang salah ini
// app.get("/api/status", votingRoutes);

// ========================================
// 🔥 API: STATUS VOTING (yang BENAR, cuma 1x)
// ========================================
app.get("/api/status", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT is_open FROM voting_status WHERE id = 1"
    );

    const isOpen = result.rows[0]?.is_open ?? false;

    return res.json({
      success: true,
      voting_open: isOpen,
    });
  } catch (error) {
    console.error("STATUS ERROR:", error);
    return res.status(500).json({
      success: false,
      voting_open: false,
      message: "Gagal mengambil status voting",
    });
  }
});

// ========================================
// API: TOTAL VOTES PER CANDIDATE
// ========================================
app.get("/api/votes", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT candidate_id, COUNT(*) AS total
      FROM voters
      GROUP BY candidate_id
    `);

    const votes = {};
    result.rows.forEach((row) => {
      votes[row.candidate_id] = Number(row.total);
    });

    res.json({ success: true, data: votes });
  } catch (err) {
    console.error("GET /api/votes ERROR:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ====================== RESET VOTING ======================
app.delete("/api/reset", async (req, res) => {
  try {
    await pool.query("TRUNCATE TABLE voters RESTART IDENTITY");

    await pool.query(
      "UPDATE voting_status SET is_open = FALSE WHERE id = 1"
    );

    return res.json({ message: "Voting berhasil direset." });
  } catch (error) {
    console.error("RESET ERROR:", error);
    res.status(500).json({ error: "Gagal mereset voting" });
  }
});

// ❌ HAPUS route status ganda ini
// app.get("/api/status", async (req, res) => { ... })

// FINAL SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
