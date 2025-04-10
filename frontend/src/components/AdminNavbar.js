import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminNavbar.css"; // Стилі для навігації адміна
import AdminSidebar from "../components/AdminSidebar"; // Імпортуємо AdminSidebar
import { FaSignOutAlt } from "react-icons/fa"; // Іконка для виходу

const AdminNavbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Стейт для контролю відкриття сайдбару
  const [user, setUser] = useState(null); // Стейт для користувача
  const navigate = useNavigate();

  useEffect(() => {
    // Перевіряємо, чи є дані користувача в localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Встановлюємо користувача з localStorage
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Перемикаємо стан сайдбару
  };

  const handleLogout = () => {
    // Видаляємо користувача з localStorage та очищуємо стейт
    localStorage.removeItem("user");
    setUser(null);
    // Перенаправляємо на головну сторінку після виходу
    navigate('/');
  };

  return (
    <div>
      {/* Навбар з іконкою трьох рисочок для відкриття сайдбару */}
      <div className="admin-navbar">
        <div className="hamburger-menu" onClick={toggleSidebar}>
          ☰ {/* Іконка трьох рисочок */}
        </div>

        <div className="navbar-title">
          PETSTORE
        </div>
        
        {/* Кнопка виходу з акаунта, якщо користувач є */}
        {user && (
          <button className="logout-button" onClick={handleLogout}>
            <FaSignOutAlt /> Вийти
          </button>
        )}
      </div>

      {/* Відображаємо сайдбар, коли isSidebarOpen є true */}
      <AdminSidebar isOpen={isSidebarOpen} />
    </div>
  );
};

export default AdminNavbar;
