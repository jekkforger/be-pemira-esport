import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import adminRoutes from "./routes/admin.js";
import votingRoutes from "./routes/voting.js";
import candidateRoutes from "./routes/candidates.js";
import voterRoutes from "./routes/voters.js";

dotenv.config();
const app = express();

// CORS FIX — penting kalau FE di Vercel, BE di Railway
app.use(cors({
  origin: "*",
  methods: "GET,POST,DELETE,PUT",
}));

app.use(express.json());

// REGISTER ROUTES
app.use("/api/admin", adminRoutes);
app.use("/api/voting", votingRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/voters", voterRoutes);

// ROOT TEST
app.get("/", (req, res) => {
  res.send("Backend Pemira Esport API is running...");
});

app.get("/api/status", async (req, res) => {
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

// SERVER LISTEN
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Server running on port " + port);
});
