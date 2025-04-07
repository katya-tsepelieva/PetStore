import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { FaShoppingCart, FaSearch, FaHome, FaList, FaPhone, FaUser, FaSignOutAlt } from "react-icons/fa";
import AuthForm from "./AuthForm";
import { useCart } from "../context/CartContext";
import "../styles/navbar.css";

const Navbar = () => {
  const [query, setQuery] = useState("");
  const [user, setUser] = useState(null);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const dropdownRef = useRef(null);

  const { cartItems = [], clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${query}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    setUser(null);
    clearCart();
    setShowUserMenu(false);
    window.location.reload();
  };

  const handleLogin = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setShowAuthForm(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">PETSTORE</Link>

        {/* <div className="nav-links">
          <Link to="/" className="nav-item"><FaHome /> Головна</Link>
        </div> */}

        <div className="nav-right">
          <form onSubmit={handleSearchSubmit} className="search-box">
            <input type="text" placeholder="Пошук товарів..." value={query} onChange={handleSearch} />
            <button type="submit"><FaSearch /></button>
          </form>

          

          <Link to="/cart" className="cart">
            <FaShoppingCart />
            {cartItems.length > 0 && <span className="cart-count">{cartItems.length}</span>}
          </Link>
          <Link to="/contacts" className="contacts"><FaPhone /></Link>

          {user ? (
            <div className="account-wrapper" ref={dropdownRef}>
              <FaUser className="account-icon" onClick={() => setShowUserMenu(!showUserMenu)} />

              {showUserMenu && (
                <div className="dropdown-menu styled-dropdown">
                  <Link to="/account" onClick={() => setShowUserMenu(false)}>Мій акаунт</Link>
                  <Link to="/my-orders" onClick={() => setShowUserMenu(false)}>Мої замовлення</Link>
                  <Link to="/favourites" onClick={() => setShowUserMenu(false)}>Моє обране</Link>
                  <button onClick={handleLogout}><FaSignOutAlt /> Вийти</button>

                </div>
              )}
            </div>
          ) : (
            <FaUser className="account-icon" onClick={() => setShowAuthForm(true)} />
          )}
        </div>
      </div>

      {showAuthForm && <AuthForm onLoginSuccess={handleLogin} onClose={() => setShowAuthForm(false)} />}
    </nav>
  );
};

export default Navbar;
