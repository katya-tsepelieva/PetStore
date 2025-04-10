const db = require("../config/db");

/**
 * Отримує всі відгуки для певного товару.
 *
 * @route GET /products/:productId/reviews
 * @param {import('express').Request} req - HTTP-запит з параметром productId
 * @param {import('express').Response} res - HTTP-відповідь з масивом відгуків або помилкою
 * @returns {Promise<void>}
 */
const getReviews = async (req, res) => {
  const { productId  } = req.params;

  try {
    const [reviews] = await db.query(`
      SELECT r.id, r.rating, r.comment, r.created_at, u.username
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ?
      ORDER BY r.created_at DESC
    `, [productId ]);

    res.json(reviews);
  } catch (error) {
    console.error("Помилка отримання відгуків:", error);
    res.status(500).json({ message: "Помилка отримання відгуків" });
  }
};

const addReview = async (req, res) => {
    const { productId  } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id; 
  
    console.log("product_id from params:", productId );
    console.log("user_id from token:", userId);
    console.log("body:", req.body);
  
    if (!rating || !comment) {
      return res.status(400).json({ message: "Всі поля обов'язкові" });
    }
  
    try {
      const [existing] = await db.query(
        'SELECT * FROM reviews WHERE product_id = ? AND user_id = ?',
        [productId , userId]
      );
  
      console.log("existing review:", existing);
  
      if (existing.length > 0) {
        return res.status(400).json({ message: "Ви вже залишили відгук для цього товару" });
      }
  
      await db.query(
        'INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
        [productId , userId, rating, comment]
      );
  
      res.status(201).json({ message: "Відгук додано" });
    } catch (err) {
      console.error("Error in addReview:", err);
      res.status(500).json({ message: "Помилка додавання відгуку" });
    }
  };
  
const updateReview = async (req, res) => {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;
  
    if (!rating || !comment) {
      return res.status(400).json({ message: "Всі поля обов'язкові" });
    }
  
    try {
      const [review] = await db.query('SELECT * FROM reviews WHERE id = ?', [reviewId]);
  
      if (review.length === 0) {
        return res.status(404).json({ message: "Відгук не знайдено" });
      }
  
      if (review[0].user_id !== userId) {
        return res.status(403).json({ message: "Ви не можете редагувати цей відгук" });
      }
  
      await db.query(
        'UPDATE reviews SET rating = ?, comment = ? WHERE id = ?',
        [rating, comment, reviewId]
      );
  
      res.json({ message: "Відгук оновлено" });
    } catch (error) {
      console.error("Помилка оновлення відгуку:", error);
      res.status(500).json({ message: "Помилка оновлення відгуку" });
    }
  };
  
  const deleteReview = async (req, res) => {
    const { reviewId } = req.params;
    const userId = req.user.id;
  
    try {
      const [review] = await db.query('SELECT * FROM reviews WHERE id = ?', [reviewId]);
  
      if (review.length === 0) {
        return res.status(404).json({ message: "Відгук не знайдено" });
      }
  
      if (review[0].user_id !== userId) {
        return res.status(403).json({ message: "Ви не можете видалити цей відгук" });
      }
  
      await db.query('DELETE FROM reviews WHERE id = ?', [reviewId]);
  
      res.json({ message: "Відгук видалено" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Помилка видалення відгуку" });
    }
  };

module.exports = {
  getReviews,
  addReview,
  updateReview,
  deleteReview,
};
