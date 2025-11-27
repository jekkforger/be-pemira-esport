import fs from "fs";

// GET status
app.get("/api/status", (req, res) => {
  const status = JSON.parse(fs.readFileSync("status.json", "utf8"));
  res.json(status);
});

// SET OPEN
app.post("/api/status/open", (req, res) => {
  fs.writeFileSync("status.json", JSON.stringify({ voting_open: true }));
  res.json({ success: true });
});

// SET CLOSE
app.post("/api/status/close", (req, res) => {
  fs.writeFileSync("status.json", JSON.stringify({ voting_open: false }));
  res.json({ success: true });
});
