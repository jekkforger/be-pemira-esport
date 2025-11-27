import express from "express";
const router = express.Router();

let votingOpen = false;
let startTime = null;
let endTime = null;

router.post("/start", (req, res) => {
  votingOpen = true;
  startTime = new Date().toISOString();
  endTime = null;

  res.json({
    success: true,
    message: "Voting dimulai",
    start_time: startTime
  });
});

router.post("/stop", (req, res) => {
  votingOpen = false;
  endTime = new Date().toISOString();

  res.json({
    success: true,
    message: "Voting dihentikan",
    end_time: endTime
  });
});

router.get("/status", (req, res) => {
  res.json({
    voting_open: votingOpen,
    start_time: startTime,
    end_time: endTime
  });
});

router.post("/reset", (req, res) => {
  votingOpen = false;
  startTime = null;
  endTime = null;

  res.json({ success: true, message: "Voting direset" });
});

export default router;
