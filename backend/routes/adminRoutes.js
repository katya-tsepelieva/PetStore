const express = require("express");
const { getAllUsers, deleteUser, makeAdmin, getUserOrders, updateOrderStatus, getAllOrders, getAllProducts, createProduct, updateProduct, deleteProduct,
    getAllReviews, deleteReview } = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();


router.get("/users", authMiddleware, adminMiddleware, getAllUsers);

router.delete("/users/:id", authMiddleware, adminMiddleware, deleteUser);

router.put("/users/:id/make-admin", authMiddleware, adminMiddleware, makeAdmin);

router.get("/users/:id/orders", authMiddleware, adminMiddleware, getUserOrders);

router.put("/orders/:orderId/status", authMiddleware, adminMiddleware, updateOrderStatus);

router.get("/orders", authMiddleware, adminMiddleware, getAllOrders);

router.get("/products", authMiddleware, adminMiddleware, getAllProducts);

router.post("/products", authMiddleware, adminMiddleware, createProduct);

router.put("/products/:id", authMiddleware, adminMiddleware, updateProduct); 

router.delete("/products/:id", authMiddleware, adminMiddleware, deleteProduct);

router.get("/reviews", authMiddleware, adminMiddleware, getAllReviews);

router.delete("/reviews/:id", authMiddleware, adminMiddleware, deleteReview);


module.exports = router;
