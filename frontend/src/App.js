import { Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { CartProvider } from "./context/CartContext";
import { FavouriteProvider } from "./context/FavouriteContext";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import CheckoutPage from "./pages/CheckoutPage";
import Navbar from "./components/Navbar";
import AdminNavbar from "./components/AdminNavbar";
import Footer from './components/Footer';
import Account from "./pages/Account";
import FavouritePage from "./pages/Favourite";
import AdminRoute from "./utils/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageProducts from "./pages/admin/ManageProducts";
import ManageOrders from "./pages/admin/ManageOrders";
import './App.css';

function App() {
  return (
    <UserProvider>
      <FavouriteProvider>
        <CartProvider>
          <div className="app-wrapper">
            <Routes>
              {/* Охорона адмінських маршрутів через AdminRoute */}
              <Route 
                path="/admin/*" 
                element={
                  <>
                    <AdminNavbar /> {/* Окремий Navbar для адміністратора */}
                    <div className="page-content">
                      <Routes>
                        <Route path="/dashboard" element={<AdminDashboard />} />
                        <Route path="/users" element={<ManageUsers />} />
                        <Route path="/products" element={<ManageProducts />} />
                        <Route path="/orders" element={<ManageOrders />} />
                      </Routes>
                    </div>
                  </>
                } 
              />
              
              {/* Загальні маршрути для користувачів */}
              <Route 
                path="/*"
                element={
                  <>
                    <Navbar /> {/* Загальний Navbar для користувача */}
                    <div className="page-content">
                      <Routes>
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/account" element={<Account />} />
                        <Route path="/create" element={<CheckoutPage />} />
                        <Route path="/my-orders" element={<MyOrdersPage />} />
                        <Route path="/favourites" element={<FavouritePage />} />
                        <Route path="/" element={<Home />} />
                        <Route path="/search" element={<Home />} />
                        <Route path="/product/:id" element={<ProductPage />} />
                      </Routes>
                    </div>
                  </>
                }
              />
            </Routes>
            <Footer /> {/* Футер завжди рендериться після контенту */}
          </div>
        </CartProvider>
      </FavouriteProvider>
    </UserProvider>
  );
}

export default App;
