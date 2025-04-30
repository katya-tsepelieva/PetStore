import { NavLink } from "react-router-dom";
import "../styles/Admin.css";

const AdminSidebar = ({ isOpen }) => {
  return (
    <nav className={`admin-sidebar-navbar ${isOpen ? "open" : ""}`}>
      <ul className="sidebar-links">
        <li>
          <NavLink 
            to="/admin/dashboard"
            className={({ isActive }) => (isActive ? "active" : "")} 
          >
            Дашборд
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/admin/users"
            className={({ isActive }) => (isActive ? "active" : "")} 
          >
            Користувачі
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/admin/products"
            className={({ isActive }) => (isActive ? "active" : "")} 
          >
            Товари
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/admin/orders"
            className={({ isActive }) => (isActive ? "active" : "")} 
          >
            Замовлення
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default AdminSidebar;
