const db = require("../config/db");

const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query("SELECT id, username, email, role FROM users");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка при отриманні списку користувачів" });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    res.json({ message: "Користувача успішно видалено" });
  } catch (err) {
    console.error(err);
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
  
      res.json({ message: "Користувача успішно зроблено адміністратором" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Помилка при зміні ролі користувача" });
    }
  };

const getUserOrders = async (req, res) => {
  const { id } = req.params;

  try {
    const [orders] = await db.query("SELECT * FROM orders WHERE user_id = ?", [id]);
    if (orders.length === 0) {
      return res.status(404).json({ message: "Замовлення для цього користувача не знайдено" });
    }

    res.json(orders);
  } catch (err) {
    console.error(err);
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

    res.json({ message: "Статус замовлення успішно оновлено" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка при оновленні статусу замовлення" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.query("SELECT * FROM orders");
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка при отриманні списку замовлень" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const [products] = await db.query("SELECT * FROM products");
    res.json(products);
  } catch (err) {
    console.error(err);
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
  } catch (err) {
    console.error(err);
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

    res.json({ message: "Товар успішно оновлено" });
  } catch (err) {
    console.error(err);
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

    res.json({ message: "Товар успішно видалено" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка при видаленні товару" });
  }
}; 

const getAllReviews = async (req, res) => {
  try {
    const [reviews] = await db.query("SELECT r.id, r.product_id, r.user_id, r.rating, r.comment, r.created_at, u.username, p.name AS product_name FROM reviews r JOIN users u ON r.user_id = u.id JOIN products p ON r.product_id = p.id");
    res.json(reviews);
  } catch (err) {
    console.error(err);
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

    res.json({ message: "Відгук успішно видалено" });
  } catch (err) {
    console.error(err);
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
