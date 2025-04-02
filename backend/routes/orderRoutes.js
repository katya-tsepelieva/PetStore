const express = require('express');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create', authMiddleware, orderController.createOrder);

router.get('/my-orders', authMiddleware, orderController.getMyOrders);

module.exports = router;
