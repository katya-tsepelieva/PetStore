import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/account.css";

const Account = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    old_Password: "",
    new_Password: "",
    last_name: "",
    first_name: "",
    patronymic: "",
    phone_number: "",
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); 
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        const token = userData?.token;
        const userId = userData?.id;

        if (!token) {
          setError("Токен не знайдено.");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:5000/api/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status !== 200) {
          setError(`Помилка сервера: ${response.statusText}`);
          setLoading(false);
          return;
        }

        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Помилка завантаження даних користувача:", error);
        if (error.response) {
          setError(`Сервер повернув помилку: ${error.response.data.message}`);
        } else {
          setError("Не вдалося завантажити дані користувача.");
        }
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const token = userData?.token;

      if (!token) {
        setError("Токен не знайдено.");
        return;
      }

      const response = await axios.put(
        "http://localhost:5000/api/auth/user/update",
        {
          username: user.username,
          email: user.email,
          old_Password: user.old_Password,
          new_Password: user.new_Password,
          last_name: user.last_name,
          first_name: user.first_name,
          patronymic: user.patronymic,
          phone_number: user.phone_number,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Оновлена відповідь сервера:", response.data);
        setIsEditing(false); 
        setUser(response.data);

        localStorage.setItem("user", JSON.stringify({ 
          ...userData, 
          username: response.data.username, 
          email: response.data.email,
          last_name: response.data.last_name,
          first_name: response.data.first_name,
          patronymic: response.data.patronymic,
          phone_number: response.data.phone_number
        }));
    
    } catch (error) {
      setError("Помилка при оновленні профілю");
      console.error(error);
    }
  };

  if (loading) {
    return <p>Завантаження...</p>;
  }

  if (error) {
    return <p>{error}</p>; 
  }

  return (
    <div className="account-container">
      <h2>Акаунт</h2>
      {!isEditing ? (
        <div className="account-details">
          <p><strong>Ім'я користувача:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Прізвище:</strong> {user.last_name}</p>
          <p><strong>Ім'я:</strong> {user.first_name}</p>
          <p><strong>По-батькові:</strong> {user.patronymic}</p>
          <p><strong>Номер телефону:</strong> {user.phone_number}</p>
          <button className="update-btn" onClick={() => setIsEditing(true)}>Редагувати профіль</button>
        </div>
      ) : (
        <div className="account-edit-form">
          <div>
            <label>Ім'я користувача:</label>
            <input
              type="text"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </div>
          <div>
            <label>Старий пароль:</label>
            <input
              type="password"
              value={user.old_Password}
              onChange={(e) => setUser({ ...user, old_Password: e.target.value })}
            />
          </div>
          <div>
            <label>Новий пароль:</label>
            <input
              type="password"
              value={user.new_Password}
              onChange={(e) => setUser({ ...user, new_Password: e.target.value })}
            />
          </div>
          <div>
            <label>Прізвище:</label>
            <input
              type="last_name"
              value={user.last_name}
              onChange={(e) => setUser({ ...user, last_name: e.target.value })}
            />
          </div>
          <div>
            <label>Ім'я:</label>
            <input
              type="first_name"
              value={user.first_name}
              onChange={(e) => setUser({ ...user, first_name: e.target.value })}
            />
          </div>
          <div>
            <label>По-батькові:</label>
            <input
              type="patronymic"
              value={user.patronymic}
              onChange={(e) => setUser({ ...user, patronymic: e.target.value })}
            />
          </div>
          <div>
            <label>Номер телефону:</label>
            <input
              type="phone_number"
              value={user.phone_number}
              onChange={(e) => setUser({ ...user, phone_number: e.target.value })}
            />
          </div>

          <button className="update-btn" onClick={handleUpdateProfile}>Зберегти зміни</button>
          <button className="update-btn" onClick={() => setIsEditing(false)}>Скасувати</button>
        </div>
      )}
    </div>
  );
};

export default Account;
