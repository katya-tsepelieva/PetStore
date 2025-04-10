import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext"; // Імпортуємо контекст

const AdminRoute = ({ element }) => {
  const { user, loading } = useContext(UserContext); // Отримуємо user та loading з контексту

  if (loading) {
    return <div>Завантаження...</div>;
  }

  if (!user || user.role !== "admin") {
    // Перенаправляємо, якщо користувач не адміністратор
    return <Navigate to="/" />;
  }

  return element;
};

export default AdminRoute;
