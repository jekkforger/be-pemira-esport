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

// ROUTES
app.use("/api/admin", adminRoutes);
app.use("/api/voting", votingRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/voters", voterRoutes);

app.get("/", (req, res) => {
  res.send("Backend Pemira Esport API is running...");
});

// ❗ PORT FIX
const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
