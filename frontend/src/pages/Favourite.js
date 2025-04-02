import React from "react";
import { useFavourite } from "../context/FavouriteContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartFilled } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom"; 
import "../styles/favourite.css";

const FavouritePage = () => {
  const { favouriteItems, removeFromFavourite } = useFavourite();

  return (
    <div className="favourite-container">
      <h2>Обрані товари</h2>

      {favouriteItems.length === 0 ? (
        <div>
          <p className="empty-favourite">Обрані товари відсутні.</p>
          <a href="/" className="go-shopping">Переглянути товари</a>
        </div>
      ) : (
        <div>
          <div className="favourite-items">
            {favouriteItems.map((item) => (
              <div key={item.product_id} className="favourite-item">
                <Link to={`/product/${item.product_id}`} className="favourite-item-link">
                  <img src={`/images/${item.image_url}`} alt={item.name} className="product-image" />
                </Link>
                
                <div className="favourite-item-details">
                  <h3>{item.name}</h3>
                  <p>{item.price} грн</p>
                </div>
                <div className="favourite-item-actions">
                  <div 
                    className="favourite-heart-page"
                    onClick={() => removeFromFavourite(item.product_id)}
                  >
                    <FontAwesomeIcon
                      icon={faHeartFilled}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FavouritePage;
