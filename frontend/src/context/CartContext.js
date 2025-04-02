import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.token) {
      axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${user.token}` },
        withCredentials: true,
      })
      .then((res) => {
        setCartItems(res.data); 
        setLoading(false); 
      })
      .catch((error) => {
        console.error("Помилка при завантаженні кошика з сервера:", error.response?.data || error.message);
        setLoading(false); 
      });
    } else {
      const savedCartItems = JSON.parse(localStorage.getItem("cartItems"));
      if (savedCartItems) {
        setCartItems(savedCartItems);
      }
      setLoading(false); 
    }
  }, []); 

  const updateCartOnLogin = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
      axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${user.token}` },
        withCredentials: true,
      })
      .then((res) => {
        setCartItems(res.data);
      })
      .catch((error) => {
        console.error("Помилка при завантаженні кошика з сервера:", error.response?.data || error.message);
      });
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
      updateCartOnLogin();
    }
  }, [localStorage.getItem("user")]); 

  const addToCart = async (product, quantity = 1) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.token) {
      alert("Спочатку увійдіть в акаунт!");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/cart/add",
        {
          product_id: product.id,
          quantity,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
          withCredentials: true,
        }
      );

      console.log("Cart response:", res.data);
      alert("Товар додано в кошик!");

      setCartItems((prev) => {
        const updatedCart = [
          ...prev,
          {
            product_id: product.id,
            quantity,
            name: product.name,
            price: product.price,
            image_url: product.image_url,
          },
        ];

        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
        return updatedCart;
      });
    } catch (error) {
      console.error("Помилка при додаванні товару:", error.response?.data || error.message);
      alert("Не вдалося додати товар у кошик.");
    }
  };

  const removeFromCart = async (product_id) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.token) {
      alert("Спочатку увійдіть в акаунт!");
      return;
    }

    try {
      const res = await axios.delete(
        `http://localhost:5000/api/cart/remove/${product_id}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
          withCredentials: true,
        }
      );

      console.log("Remove response:", res.data);
      alert("Товар видалено з кошика!");

      setCartItems((prev) => {
        const updatedCart = prev.filter((item) => item.product_id !== product_id);

        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
        return updatedCart;
      });
    } catch (error) {
      console.error("Помилка при видаленні товару:", error.response?.data || error.message);
      alert("Не вдалося видалити товар з кошика.");
    }
  };

  const updateCartItem = async (product_id, quantity) => {
    const user = JSON.parse(localStorage.getItem("user"));
  
    if (!user || !user.token) {
      alert("Спочатку увійдіть в акаунт!");
      return;
    }
  
    if (quantity < 1) {
      alert("Кількість товару не може бути меншою за 1");
      return;
    }
  
    try {
      const res = await axios.put(
        "http://localhost:5000/api/cart/update",
        { product_id, quantity }, 
        {
          headers: { Authorization: `Bearer ${user.token}` },
          withCredentials: true
        }
      );
  
      console.log("Update response:", res.data);
      alert("Кількість товару оновлено!");
  
      setCartItems((prev) => {
        const updatedCart = prev.map(item => 
          item.product_id === product_id ? { ...item, quantity } : item
        );

        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
        return updatedCart;
      });
  
    } catch (error) {
      console.error("Помилка при оновленні кількості товару:", error.response?.data || error.message);
      alert("Не вдалося оновити кількість товару.");
    }
  };

  const clearCart = () => {
    setCartItems([]); 
    localStorage.removeItem("cartItems"); 
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateCartItem, clearCart }}>
      {loading ? <div>Завантаження...</div> : children}
    </CartContext.Provider>
  );
};
