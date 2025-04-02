const express = require("express");
const { registerUser, loginUser, getUserData, updateUserData } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/register", (req, res) => {
  res.json({ message: "Use POST /api/auth/register to create an account" });
});

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/profile", authMiddleware, (req, res) => {
  res.json({ message: "Це захищена інформація", user: req.user });
});

router.get("/user", authMiddleware, getUserData);

router.put("/user/update", authMiddleware, updateUserData);

module.exports = router;
