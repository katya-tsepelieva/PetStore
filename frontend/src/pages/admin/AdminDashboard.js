import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/AdminDashboard.css"; // Підключаємо стилі
import AdminNavbar from "../../components/AdminNavbar"; // Імпортуємо навігаційну панель

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("user");
    if (!token) {
      navigate("/"); 
      return;
    }

    const user = JSON.parse(token);
    if (user.role !== "admin") {
      navigate("/"); 
    } else {
      setIsLoading(false); 
    }
  }, [navigate]);

  if (isLoading) {
    return <div className="loading">Loading...</div>; 
  }

  return (
    <div className="admin-dashboard">

      {/* Контент дашборду */}
      <div className="dashboard-content">
        <h2>Ласкаво просимо в Адмін панель</h2>
        {/* Додатковий контент */}
      </div>
    </div>
  );
};

export default AdminDashboard;
