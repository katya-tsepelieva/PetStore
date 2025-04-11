const db = require("../config/db");
const logger = require("../logger");

const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query("SELECT id, username, email, role FROM users");
    res.json(users);
  } catch (error) {
    logger.error(`Помилка при отриманні списку користувачів: ${error.message}`, { stack: error.stack });
    res.status(500).json({ message: "Помилка при отриманні списку користувачів" });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      logger.warn(`Користувача з id ${id} не знайдено`);
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    logger.info(`Користувач з id ${id} успішно видалений`);
    res.json({ message: "Користувача успішно видалено" });
  } catch (error) {
    logger.error(`Помилка при видаленні користувача з id ${id}: ${error.message}`, { stack: error.stack });
    res.status(500).json({ message: "Помилка при видаленні користувача" });
  }
};

const makeAdmin = async (req, res) => {
    const { id } = req.params;
  
    try {
      const [users] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
      if (users.length === 0) {
        return res.status(404).json({ message: "Користувача не знайдено" });
      }
  
      await db.query("UPDATE users SET role = 'admin' WHERE id = ?", [id]);
  
      logger.info(`Користувача успішно зроблено адміністратором`);
      res.json({ message: "Користувача успішно зроблено адміністратором" });
    } catch (error) {
      logger.error(`Помилка при зміні ролі користувача: ${error.message}`, { stack: error.stack });
      res.status(500).json({ message: "Помилка при зміні ролі користувача" });
    }
  };

const getUserOrders = async (req, res) => {
  const { id } = req.params;

  try {
    const [orders] = await db.query(`
      SELECT o.*, u.username AS customerName
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.user_id = ?
    `, [id]);

    if (orders.length === 0) {
      return res.status(404).json({ message: "Замовлення для цього користувача не знайдено" });
    }

    const orderIds = orders.map(order => order.id);

    const [orderItems] = await db.query(`
      SELECT oi.order_id, p.name AS productName, oi.quantity, oi.price
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id IN (?)
    `, [orderIds]);

    const orderMap = {};
    orders.forEach(order => {
      orderMap[order.id] = { ...order, products: [] };
    });

    orderItems.forEach(item => {
      if (orderMap[item.order_id]) {
        orderMap[item.order_id].products.push({
          name: item.productName,
          quantity: item.quantity,
          price: item.price
        });
      }
    });

    res.json(Object.values(orderMap));
  } catch (error) {
    logger.error(`Помилка при отриманні замовлень користувача: ${error.message}`, { stack: error.stack });
    res.status(500).json({ message: "Помилка при отриманні замовлень користувача" });
  }
};


const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const [orders] = await db.query("SELECT * FROM orders WHERE id = ?", [orderId]);
    if (orders.length === 0) {
      return res.status(404).json({ message: "Замовлення не знайдено" });
    }

    await db.query("UPDATE orders SET status = ? WHERE id = ?", [status, orderId]);

    logger.info(`Статус замовлення успішно оновлено`);
    res.json({ message: "Статус замовлення успішно оновлено" });
  } catch (error) {
    logger.error(`Помилка при оновленні статусу замовлення: ${error.message}`, { stack: error.stack });
    res.status(500).json({ message: "Помилка при оновленні статусу замовлення" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT o.*, u.username AS customerName
      FROM orders o
      JOIN users u ON o.user_id = u.id
    `);

    if (orders.length === 0) {
      return res.status(404).json({ message: "Жодного замовлення не знайдено" });
    }

    const orderIds = orders.map(order => order.id);

    const [orderItems] = await db.query(`
      SELECT oi.order_id, p.name AS productName, oi.quantity, oi.price
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id IN (?)
    `, [orderIds]);

    const orderMap = {};
    orders.forEach(order => {
      orderMap[order.id] = { ...order, products: [] };
    });

    orderItems.forEach(item => {
      if (orderMap[item.order_id]) {
        orderMap[item.order_id].products.push({
          name: item.productName,
          quantity: item.quantity,
          price: item.price
        });
      }
    });

    res.json(Object.values(orderMap));
  } catch (error) {
    logger.error(`Помилка при отриманні списку замовлень: ${error.message}`, { stack: error.stack });
    res.status(500).json({ message: "Помилка при отриманні списку замовлень" });
  }
};


const getAllProducts = async (req, res) => {
  try {
    const [products] = await db.query("SELECT * FROM products");
    res.json(products);
  } catch (error) {
    logger.error(`Помилка при отриманні списку товарів: ${error.message}`, { stack: error.stack });
    res.status(500).json({ message: "Помилка при отриманні списку товарів" });
  }
};

const createProduct = async (req, res) => {
  const { name, description, price, stock, image_url, category, target, brand } = req.body;

  try {
    const [result] = await db.query(
      "INSERT INTO products (name, description, price, stock, image_url, category, target, brand) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [name, description, price, stock, image_url, category, target, brand]
    );

    res.status(201).json({
      message: "Товар успішно створено",
      product: {
        id: result.insertId,
        name,
        description,
        price,
        stock,
        image_url,
        category,
        target,
        brand,
      },
    });
  } catch (error) {
    logger.error(`Помилка при створенні товару: ${error.message}`, { stack: error.stack });
    res.status(500).json({ message: "Помилка при створенні товару" });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, image_url, category, target, brand } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE products SET name = ?, description = ?, price = ?, stock = ?, image_url = ?, category = ?, target = ?, brand = ? WHERE id = ?",
      [name, description, price, stock, image_url, category, target, brand, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Товар не знайдено" });
    }

    logger.info(`Товар успішно оновлено`);
    res.json({ message: "Товар успішно оновлено" });
  } catch (error) {
    logger.error(`Помилка при оновленні товару: ${error.message}`, { stack: error.stack });
    res.status(500).json({ message: "Помилка при оновленні товару" });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM products WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Товар не знайдено" });
    }

    logger.info(`Товар успішно видалено`);
    res.json({ message: "Товар успішно видалено" });
  } catch (error) {
    logger.error(`Помилка при видаленні товару: ${error.message}`, { stack: error.stack });
    res.status(500).json({ message: "Помилка при видаленні товару" });
  }
}; 

const getAllReviews = async (req, res) => {
  try {
    const [reviews] = await db.query("SELECT r.id, r.product_id, r.user_id, r.rating, r.comment, r.created_at, u.username, p.name AS product_name FROM reviews r JOIN users u ON r.user_id = u.id JOIN products p ON r.product_id = p.id");
    res.json(reviews);
  } catch (error) {
    logger.error(`Помилка при отриманні відгуків: ${error.message}`, { stack: error.stack });
    res.status(500).json({ message: "Помилка при отриманні відгуків" });
  }
};

const deleteReview = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM reviews WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Відгук не знайдено" });
    }

    logger.info(`Відгук успішно видалено`);
    res.json({ message: "Відгук успішно видалено" });
  } catch (err) {
    logger.error(`Помилка при видаленні відгуку: ${error.message}`, { stack: error.stack });
    res.status(500).json({ message: "Помилка при видаленні відгуку" });
  }
};
  

module.exports = {
  getAllUsers,
  deleteUser,
  makeAdmin,
  getUserOrders, 
  updateOrderStatus,
  getAllOrders,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllReviews,
  deleteReview,
};
