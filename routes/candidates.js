import express from "express";
import { db } from "../db.js";

const router = express.Router();

// GET ALL CANDIDATES
router.get("/", async (req, res) => {
  const result = await db.query("SELECT * FROM candidates ORDER BY id ASC");
  res.json({ success: true, data: result.rows });
});

// ADD CANDIDATE
router.post("/", async (req, res) => {
  const { name, vision, mission, image } = req.body;

  await db.query(
    "INSERT INTO candidates (name, vision, mission, image) VALUES ($1, $2, $3, $4)",
    [name, vision, mission, image]
  );

  res.json({ success: true, message: "Kandidat ditambahkan" });
});

// DELETE
router.delete("/:id", async (req, res) => {
  await db.query("DELETE FROM candidates WHERE id = $1", [req.params.id]);
  res.json({ success: true, message: "Kandidat dihapus" });
});

export default router;
