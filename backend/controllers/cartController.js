const db = require("../config/db");

const addToCart = async (req, res) => {
  const { product_id, quantity } = req.body;
  const user_id = req.user.id; 

  if (!product_id || !quantity || quantity <= 0) {
    return res.status(400).json({ message: "Некоректні дані для додавання у кошик" });
  }

  try {
    const [product] = await db.query("SELECT price FROM products WHERE id = ?", [product_id]);
    if (product.length === 0) {
      return res.status(404).json({ message: "Товар не знайдено" });
    }
    const price = product[0].price;

    const [cartItem] = await db.query(
      "SELECT * FROM cart WHERE user_id = ? AND product_id = ?",
      [user_id, product_id]
    );

    if (cartItem.length > 0) {
      await db.query(
        "UPDATE cart SET quantity = quantity + ?, price = ? * (quantity + ?) WHERE user_id = ? AND product_id = ?",
        [quantity, price, quantity, user_id, product_id]
      );
    } else {
      await db.query(
        "INSERT INTO cart (user_id, product_id, quantity, price) VALUES (?, ?, ?, ? * ?)",
        [user_id, product_id, quantity, price, quantity]
      );
    }

    res.status(200).json({ message: "Товар додано у кошик" });
  } catch (error) {
    console.error("Помилка при додаванні товару в кошик:", error);
    res.status(500).json({ message: "Помилка сервера" });
  }
};

const getCart = async (req, res) => {
  const user_id = req.user.id;

  try {
    const [cartItems] = await db.query(
      `SELECT c.id, c.product_id, p.name, c.quantity, c.price, p.image_url 
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [user_id]
    );

    res.json(cartItems);
  } catch (error) {
    console.error("Помилка отримання кошика:", error);
    res.status(500).json({ message: "Помилка сервера" });
  }
};

const updateCart = async (req, res) => {
  console.log("Запит PUT:", req.body);  
  const { product_id, quantity } = req.body;
  const user_id = req.user.id;

  if (!product_id || !quantity || quantity <= 0) {
      return res.status(400).json({ message: "Некоректні дані для оновлення" });
  }

  try {
      const [product] = await db.query("SELECT price FROM products WHERE id = ?", [product_id]);

      if (product.length === 0) {
          return res.status(404).json({ message: "Товар не знайдено" });
      }

      const unit_price = product[0].price;  
      const price = unit_price * quantity;  

      await db.query("UPDATE cart SET quantity = ?, price = ? WHERE user_id = ? AND product_id = ?", 
          [quantity, price, user_id, product_id]);

      res.status(200).json({ message: "Кількість товару та ціна оновлені", price });
  } catch (error) {
      console.error("Помилка оновлення:", error);
      res.status(500).json({ message: "Помилка сервера" });
  }
};

const removeFromCart = async (req, res) => {
  console.log("Запит DELETE:", req.params);  
  const { product_id } = req.params;
  const user_id = req.user.id;

  if (!product_id) {
      return res.status(400).json({ message: "Некоректні дані для видалення" });
  }

  try {
      const [result] = await db.query("DELETE FROM cart WHERE user_id = ? AND product_id = ?", [user_id, product_id]);

      if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Товар не знайдено у кошику" });
      }

      res.status(200).json({ message: "Товар видалено з кошика" });
  } catch (error) {
      console.error("Помилка видалення товару з кошика:", error);
      res.status(500).json({ message: "Помилка сервера" });
  }
};

const clearCart = async (req, res) => {
  const user_id = req.user.id;

  try {
    await db.query("DELETE FROM cart WHERE user_id = ?", [user_id]);
    res.status(200).json({ message: "Кошик очищено" });
  } catch (error) {
    console.error("Помилка очищення кошика:", error);
    res.status(500).json({ message: "Помилка сервера" });
  }
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
  updateCart, 
};
