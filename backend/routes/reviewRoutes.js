const express = require("express");
const { getReviews, addReview, updateReview, deleteReview } = require("../controllers/reviewController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @route GET /products/:productId/reviews
 * @group Reviews
 * @param {string} productId.path.required - ID товару
 * @returns {Array<object>} 200 - Масив відгуків
 */
router.get("/products/:productId/reviews", getReviews);

router.post("/products/:productId/reviews", authMiddleware, addReview);

router.put("/products/:productId/reviews/:reviewId", authMiddleware, updateReview);

router.delete("/products/:productId/reviews/:reviewId", authMiddleware, deleteReview);

module.exports = router;
