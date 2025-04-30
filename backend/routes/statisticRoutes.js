const express = require('express');
const router = express.Router();
const db = require("../config/db");  

router.get('/statistic', async (req, res) => {
  try {
    const [usersResult] = await db.query('SELECT COUNT(*) AS totalUsers FROM users');
    const [ordersResult] = await db.query('SELECT COUNT(*) AS totalOrders FROM orders');

    const [monthlyOrders] = await db.query(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') AS month,
        COUNT(*) AS ordersCount
      FROM orders
      GROUP BY month
      ORDER BY month ASC
    `);

    res.json({
      totalUsers: usersResult[0].totalUsers,
      totalOrders: ordersResult[0].totalOrders,
      monthlyOrders
    });

  } catch (error) {
    console.error('Помилка при отриманні статистики:', error);
    res.status(500).json({ error: 'Серверна помилка' });
  }
});

module.exports = router;
