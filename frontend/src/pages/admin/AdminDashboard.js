import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";

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
    return <div>Loading...</div>; 
  }

  return (
    <div>
      <AdminSidebar />
      <h1>Адмін Панель</h1>
    </div>
  );
};

export default AdminDashboard;
