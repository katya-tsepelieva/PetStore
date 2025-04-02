const express = require("express");
const { addToFavourite, getFavourite, removeFromFavourite, clearFavourite } = require("../controllers/favouritesController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getFavourite);

router.post("/add", authMiddleware, addToFavourite);

router.delete("/remove/:product_id", authMiddleware, removeFromFavourite);

router.post("/clear", authMiddleware, clearFavourite);

module.exports = router;
