import express from "express";
const router = express.Router();

const ADMIN_USERNAME = "admin";
const ADMIN_PASS = "polbanesport2025";

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASS) {
    return res.json({ success: true, message: "Login berhasil" });
  }

  return res.json({ success: false, message: "Username atau password salah" });
});

export default router;
