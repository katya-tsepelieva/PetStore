const db = require("../config/db");

const addToFavourite = async (req, res) => {
  const { product_id} = req.body;
  const user_id = req.user.id; 

  if (!product_id ) {
    return res.status(400).json({ message: "Некоректні дані для додавання в обране" });
  }

  try {
    const [product] = await db.query("SELECT price FROM products WHERE id = ?", [product_id]);
    if (product.length === 0) {
      return res.status(404).json({ message: "Товар не знайдено" });
    }
    const price = product[0].price;

    const [favouriteItem] = await db.query(
      "SELECT * FROM favourites WHERE user_id = ? AND product_id = ?",
      [user_id, product_id]
    );

     if (favouriteItem.length == 0) {
       await db.query(
         "INSERT INTO favourites (user_id, product_id) VALUES (?, ?)",
         [user_id, product_id]
       );
     }

    res.status(200).json({ message: "Товар додано в обране" });
  } catch (error) {
    console.error("Помилка при додаванні товару в обране:", error);
    res.status(500).json({ message: "Помилка сервера" });
  }
};

const getFavourite = async (req, res) => {
  const user_id = req.user.id;

  try {
    const [favouriteItem] = await db.query(
      `SELECT f.id, f.product_id, p.name, p.image_url, p.price, p.stock 
       FROM favourites f
       JOIN products p ON f.product_id = p.id
       WHERE f.user_id = ?`,
      [user_id]
    );

    res.json(favouriteItem);
  } catch (error) {
    console.error("Помилка отримання обраного:", error);
    res.status(500).json({ message: "Помилка сервера" });
  }
};

const removeFromFavourite = async (req, res) => {
  console.log("Запит DELETE:", req.params);  
  const { product_id } = req.params;
  const user_id = req.user.id;

  if (!product_id) {
      return res.status(400).json({ message: "Некоректні дані для видалення" });
  }

  try {
      const [result] = await db.query("DELETE FROM favourites WHERE user_id = ? AND product_id = ?", [user_id, product_id]);

      if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Товар не знайдено в обраному" });
      }

      res.status(200).json({ message: "Товар видалено з обраного" });
  } catch (error) {
      console.error("Помилка видалення товару з обраного:", error);
      res.status(500).json({ message: "Помилка сервера" });
  }
};

const clearFavourite = async (req, res) => {
  const user_id = req.user.id;

  try {
    await db.query("DELETE FROM favourites WHERE user_id = ?", [user_id]);
    res.status(200).json({ message: "Обране очищено" });
  } catch (error) {
    console.error("Помилка очищення обраного:", error);
    res.status(500).json({ message: "Помилка сервера" });
  }
};

module.exports = {
  addToFavourite,
  getFavourite,
  removeFromFavourite,
  clearFavourite,
};
