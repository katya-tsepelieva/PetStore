const express = require("express");
const { addToCart, getCart, removeFromCart, updateCart, clearCart } = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getCart);

router.post("/add", authMiddleware, addToCart);

router.delete("/remove/:product_id", authMiddleware, removeFromCart);

router.put("/update", authMiddleware, updateCart);

router.post("/clear", authMiddleware, clearCart);

module.exports = router;
