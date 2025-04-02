const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
require("dotenv").config(); 

const registerUser = async (req, res) => {
  const { username, email, password, role = "user", last_name, first_name, patronymic, phone_number } = req.body; 

  if (!username || !email || !password || !last_name || !first_name || !patronymic || !phone_number) {
    return res.status(400).json({ message: "Усі поля є обов'язковими" });
  }

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length > 0) {
      return res.status(400).json({ message: "Користувач з таким email вже існує" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = "INSERT INTO users (username, email, password, role, last_name, first_name, patronymic, phone_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    await db.query(query, [username, email, hashedPassword, role, last_name, first_name, patronymic, phone_number]);

    res.status(201).json({ message: "Користувача успішно зареєстровано" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка реєстрації" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Усі поля є обов'язковими" });
  }

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(400).json({ message: "Користувача не знайдено" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Невірний пароль" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Вхід успішний",
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка входу" });
  }
};

const getUserData = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Неавторизований доступ" });
    }

    const [rows] = await db.query(
      "SELECT id, username, email, role, last_name, first_name, patronymic, phone_number FROM users WHERE id = ?",
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Користувач не знайдений" });
    }

    const user = rows[0];

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role, 
      last_name: user.last_name,
      first_name: user.first_name,
      patronymic: user.patronymic,
      phone_number: user.phone_number,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка при отриманні даних користувача" });
  }
};

const updateUserData = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Неавторизований доступ" });
    }

    const { username, email, last_name, first_name, patronymic, phone_number, old_Password, new_Password } = req.body;
    const userId = req.user.id;

    if (!username || !email || !last_name || !first_name || !patronymic || !phone_number) {
      return res.status(400).json({ message: "Необхідно надати дані!" });
    }

    if (new_Password) {
      const [userRows] = await db.query("SELECT password FROM users WHERE id = ?", [userId]);
      if (userRows.length === 0) {
        return res.status(404).json({ message: "Користувач не знайдений" });
      }

      const user = userRows[0];

      const isMatch = await bcrypt.compare(old_Password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Невірний старий пароль" });
      }

      const hashedPassword = await bcrypt.hash(new_Password, 10);

      await db.query(
        "UPDATE users SET username = ?, email = ?, password = ?, last_name = ?, first_name = ?, patronymic = ?, phone_number = ?  WHERE id = ?",
        [username, email, hashedPassword, last_name, first_name, patronymic, phone_number, userId]
      );
    } else {
      await db.query(
        "UPDATE users SET username = ?, email = ?, last_name = ?, first_name = ?, patronymic = ?, phone_number = ? WHERE id = ?",
        [username, email, last_name, first_name, patronymic, phone_number, userId]
      );
    }

    const [updatedUser] = await db.query(
      "SELECT id, username, email, last_name, first_name, patronymic, phone_number FROM users WHERE id = ?",
      [userId]
    );
    res.json(updatedUser[0]);
    

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка при оновленні профілю" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserData,
  updateUserData
};
