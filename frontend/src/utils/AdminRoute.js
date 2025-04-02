import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const [loading, setLoading] = useState(true);
  const [redirect, setRedirect] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const user = JSON.parse(atob(token.split('.')[1])); // Розшифровка токена для отримання користувача

      if (!user) {
        setRedirect("/"); // Якщо немає користувача, редірект на домашню сторінку
        return;
      }

      if (user.role !== "admin") {
        setRedirect("/"); // Якщо роль не "admin", редірект на домашню сторінку
        return;
      }
    } else {
      setRedirect("/"); // Якщо немає токена, редірект на домашню сторінку
    }

    setLoading(false); // Завершили перевірку
  }, []);

  if (loading) {
    return <div>Завантаження...</div>; // Показуємо завантаження, поки перевірка не завершена
  }

  if (redirect) {
    return <Navigate to={redirect} />; // Редірект, якщо умови не виконуються
  }

  return <Outlet />; // Якщо все добре, рендеримо дочірні маршрути
};

export default AdminRoute;
