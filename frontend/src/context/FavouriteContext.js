import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const FavouriteContext = createContext();

export const useFavourite = () => useContext(FavouriteContext);

export const FavouriteProvider = ({ children }) => {
  const [favouriteItems, setFavouriteItems] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const savedFavouritesItems = JSON.parse(localStorage.getItem("favouriteItems"));

    if (user && user.token) {
      axios.get("http://localhost:5000/api/favourites", {
        headers: { Authorization: `Bearer ${user.token}` },
        withCredentials: true,
      })
      .then((res) => {
        setFavouriteItems(res.data);
        localStorage.setItem("favouriteItems", JSON.stringify(res.data));  
      })
      .catch((error) => {
        console.error("Помилка при завантаженні обраного з сервера:", error.response?.data || error.message);
        if (savedFavouritesItems) {
          setFavouriteItems(savedFavouritesItems); 
        }
      });
    } else if (savedFavouritesItems) {
      setFavouriteItems(savedFavouritesItems); 
    }
  }, []);

  const addToFavourite = async (product) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.token) {
      alert("Спочатку увійдіть в акаунт!");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/favourites/add",
        { product_id: product.id },
        {
          headers: { Authorization: `Bearer ${user.token}` },
          withCredentials: true,
        }
      );

      setFavouriteItems((prev) => {
        const updatedFavourite = [
          ...prev,
          {
            product_id: product.id,
            name: product.name,
            price: product.price,
            image_url: product.image_url,
          },
        ];

        localStorage.setItem("favouriteItems", JSON.stringify(updatedFavourite));  
        return updatedFavourite;
      });

      alert("Товар додано в обране!");
    } catch (error) {
      console.error("Помилка при додаванні товару:", error.response?.data || error.message);
      alert("Не вдалося додати товар в обране.");
    }
  };

  const removeFromFavourite = async (product_id) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.token) {
      alert("Спочатку увійдіть в акаунт!");
      return;
    }

    try {
      const res = await axios.delete(
        `http://localhost:5000/api/favourites/remove/${product_id}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
          withCredentials: true,
        }
      );

      setFavouriteItems((prev) => {
        const updatedFavourite = prev.filter((item) => item.product_id !== product_id);

        localStorage.setItem("favouriteItems", JSON.stringify(updatedFavourite));  
        return updatedFavourite;
      });

      alert("Товар видалено з обраного!");
    } catch (error) {
      console.error("Помилка при видаленні товару:", error.response?.data || error.message);
      alert("Не вдалося видалити товар з обраного.");
    }
  };

  const clearFavourite = () => {
    setFavouriteItems([]);  
    localStorage.removeItem("favouriteItems");  
  };

  return (
    <FavouriteContext.Provider value={{ favouriteItems, addToFavourite, removeFromFavourite, clearFavourite }}>
      {children}
    </FavouriteContext.Provider>
  );
};
