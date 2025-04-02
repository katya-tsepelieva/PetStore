import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import BannerSlider from '../components/BannerSlider';
import { useFavourite } from "../context/FavouriteContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartFilled } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';

import "../styles/home.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortType, setSortType] = useState('default');
  const [showFilter, setShowFilter] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [targetFilter, setTargetFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get("q") || "";
  const { addToCart } = useCart();
  const { addToFavourite, removeFromFavourite, favouriteItems } = useFavourite();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Помилка завантаження товарів:", error);
      }
    };
    fetchProducts();
  }, []);

  const isFavourite = (productId) => favouriteItems.some(item => item.product_id === productId);

  useEffect(() => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered = filtered.filter((product) => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    if (targetFilter) {
      filtered = filtered.filter((product) => product.target === targetFilter);
    }

    if (categoryFilter) {
      filtered = filtered.filter((product) => product.category === categoryFilter);
    }

    if (inStockOnly) {
      filtered = filtered.filter((product) => product.stock > 0);
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sortType === 'price_asc') return a.price - b.price;
      if (sortType === 'price_desc') return b.price - a.price;
      if (sortType === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

    setFilteredProducts(sorted);
  }, [searchQuery, products, sortType, priceRange, targetFilter, categoryFilter, inStockOnly]);

  return (
    
    <div className="home-container">
      <BannerSlider />
      <h1 className="home-title">Каталог товарів</h1>
      {searchQuery && <h2>Результати пошуку для: "{searchQuery}"</h2>}

      <div className="controls">
        <button className="filter-btn" onClick={() => setShowFilter(!showFilter)}>
          {showFilter ? "Закрити фільтр" : "Фільтрувати"}
        </button>
        <div className="sort-block">
          <label>Сортувати за:</label>
          <select value={sortType} onChange={(e) => setSortType(e.target.value)} className="sort-select">
            <option value="default">За замовчуванням</option>
            <option value="price_asc">Спочатку дешевше</option>
            <option value="price_desc">Спочатку дорожче</option>
            <option value="name">За назвою</option>
          </select>
        </div>
      </div>

      {showFilter && (
        <div className="filter-panel">
          <h3>Фільтр</h3>

          <div className="filter-group">
            <label>Ціновий діапазон:</label>
            <div className="price-range">
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                min="0"
                placeholder="Від"
              />
              <span> - </span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                min="0"
                placeholder="До"
              />
            </div>
          </div>

          <div className="filter-group">
          <label>Для кого:</label>
            <div className="styled-select">
              <select value={targetFilter} onChange={(e) => setTargetFilter(e.target.value)}>
                <option value="">Усі</option>
                <option value="dogs">Собаки</option>
                <option value="cats">Коти</option>
                <option value="birds">Птахи</option>
                <option value="rodents">Гризуни</option>
                <option value="fish">Риби</option>
              </select>
            </div>
          </div>

          <div className="filter-group">
            <label>Категорія:</label>
            <div className="styled-select">
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="">Усі</option>
                <option value="Food">Корм</option>
                <option value="Toys">Іграшки</option>
                <option value="Accessories">Аксесуари</option>
                <option value="Aquatic">Акваріуми</option>
              </select>
            </div>
          </div>

          <div className="filter-group">
            <label>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={() => setInStockOnly(!inStockOnly)}
              />
                Тільки в наявності
            </label>
          </div>


          <button
            className="reset-filter-btn"
            onClick={() => {
              setPriceRange([0, 1000]);
              setTargetFilter('');
              setCategoryFilter('');
              setInStockOnly(false);
            }}
          >
            Скинути фільтр
          </button>

        </div>
      )}

      <div className="product-grid">
        {filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <div
              className={`favourite-heart ${isFavourite(product.id) ? "filled" : "empty"}`}
              onClick={() => isFavourite(product.id) ? removeFromFavourite(product.id) : addToFavourite(product)}
            >
              <FontAwesomeIcon
                icon={isFavourite(product.id) ? faHeartFilled : faHeartRegular}
              />
            </div>

            <Link to={`/product/${product.id}`} className="product-link">
              <img src={`/images/${product.image_url}`} alt={product.name} className="product-image" />
            </Link>
            <h2 className="product-name">{product.name}</h2>
            <p className="product-price">{product.price} грн</p>

            {product.stock > 0 ? (
              <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
                Додати в кошик
              </button>
            ) : (
              <div className="out-of-stock">Немає в наявності</div>
            )}
          </div>
        ))
      ) : (
        <p className="no-results">Нічого не знайдено</p>
      )}
      </div>

    </div>
  );
};

export default Home;
