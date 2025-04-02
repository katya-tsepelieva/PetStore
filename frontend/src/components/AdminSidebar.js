import { NavLink } from "react-router-dom";
import "../styles/Admin.css";

const AdminSidebar = () => {
  return (
    <nav className="admin-sidebar">
      <ul>
        <li><NavLink to="/admin">🏠 Дашборд</NavLink></li>
        <li><NavLink to="/admin/users">👥 Користувачі</NavLink></li>
        <li><NavLink to="/admin/products">🛒 Товари</NavLink></li>
        {/* <li><NavLink to="/admin/orders">📦 Замовлення</NavLink></li>
        <li><NavLink to="/admin/reviews">💬 Відгуки</NavLink></li> */}
      </ul>
    </nav>
  );
};

export default AdminSidebar;
