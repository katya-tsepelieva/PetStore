import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar";
import "../../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState(null);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("user");
        const user = token && JSON.parse(token);

        if (user?.role === "admin") {
          const response = await fetch("http://localhost:5000/api/statistic");
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Помилка завантаження статистики:", error);
      }
    };

    fetchData();
  }, []); 

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (!stats) {
    return <div className="loading">Завантаження статистики...</div>;
  }

  return (
    <div className="admin-dashboard">
      <AdminNavbar />
      <div className="dashboard-content">
        <h2>Ласкаво просимо в Адмін панель</h2>
        <div className="statistics">
          <div>
            <h3>Користувачів: {stats.totalUsers}</h3>
            <h3>Замовлень: {stats.totalOrders}</h3>
          </div>
          <div>
            <h3>Замовлення по місяцях:</h3>
            <ul>
              {stats.monthlyOrders.map((order, index) => (
                <li key={index}>
                  {order.month}: {order.ordersCount} замовлень
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
