const express = require("express");
const router = express.Router();
const db = require("../config/db"); 
const logger = require("../logger");

router.get("/", async (req, res) => {
  try {
    const { target, category } = req.query;

    let sql = "SELECT * FROM products";
    const params = [];

    if (target || category) {
      sql += " WHERE";
      if (target) {
        sql += " target = ?";
        params.push(target);
      }
      if (category) {
        if (target) { 
          sql += " AND";
        }
        sql += " category = ?";
        params.push(category);
      }
    }

    const [products] = await db.query(sql, params);
    res.json(products);
  } catch (error) {
    logger.error(`Помилка отримання продуктів: ${error.message}`, { stack: error.stack });
    res.status(500).json({ message: "Помилка сервера" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    console.log("Отримання продукту з ID:", productId); 

    const [product] = await db.query("SELECT * FROM products WHERE id = ?", [productId]);
    console.log("Результат запиту:", product); 

    if (product.length === 0) {
      return res.status(404).json({ message: "Продукт не знайдено" });
    }

    res.json(product[0]);
  } catch (error) {
    logger.error(`Помилка отримання продукту: ${error.message}`, { stack: error.stack });
    res.status(500).json({ message: "Помилка сервера", error: error.message });
  }
});


module.exports = router;
