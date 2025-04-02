import { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";  // імпортуємо useNavigate для редіректу

import "../styles/authform.css";

const AuthForm = ({ onLoginSuccess, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [last_name, setLastname] = useState("");
  const [first_name, setFirstname] = useState("");
  const [patronymic, setPatronymic] = useState("");
  const [phone_number, setPhonenumber] = useState("");
  const [error, setError] = useState("");
  
  const navigate = useNavigate();  // для редіректу

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const url = isLogin
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/register";

      const data = isLogin ? { email, password } : { username, last_name, first_name, patronymic, phone_number, email, password };
      const response = await axios.post(url, data);

      console.log("Дані з сервера:", response.data);

      if (isLogin) {
        alert("Вхід успішний!");

        const decoded = jwtDecode(response.data.token);
        console.log("Розшифрований токен:", decoded);

        const userData = {
          id: decoded.id, 
          token: response.data.token,
          role: decoded.role // припустимо, роль зберігається у токені
        };

        localStorage.setItem("user", JSON.stringify(userData));

        console.log("Збережений user:", localStorage.getItem("user"));

        onLoginSuccess(userData);

        // Перевірка ролі після входу
        if (userData.role === "admin") {
          navigate("/admin/dashboard");  // редірект на адмін панель
        } else {
          navigate("/");  // якщо не адмін, редірект на головну
        }
      } else {
        alert("Реєстрація успішна! Тепер можете увійти.");
        setIsLogin(true);
      }

      onClose();
    } catch (error) {
      console.error("Помилка:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Щось пішло не так. Спробуйте ще раз.");
    }
  };

  return (
    <div className="auth-modal" onClick={onClose}>
      <div className="auth-in-form" onClick={(e) => e.stopPropagation()}>
        <h2>{isLogin ? "Вхід" : "Реєстрація"}</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Ім'я користувача"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Прізвище"
                value={last_name}
                onChange={(e) => setLastname(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Ім'я"
                value={first_name}
                onChange={(e) => setFirstname(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="По-батькові"
                value={patronymic}
                onChange={(e) => setPatronymic(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Номер телефону"
                value={phone_number}
                onChange={(e) => setPhonenumber(e.target.value)}
                required
              />
            </>
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">{isLogin ? "Увійти" : "Зареєструватися"}</button>
        </form>
        <p onClick={() => setIsLogin(!isLogin)} className="toggle-form">
          {isLogin ? "Немає акаунта? Зареєструйтесь!" : "Вже маєте акаунт? Увійдіть!"}
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
