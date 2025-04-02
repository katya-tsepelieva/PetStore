import React from "react";
import { useCart } from "../context/CartContext";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/cart.css";


const CartPage = () => {
  const { cartItems, removeFromCart, updateCartItem } = useCart();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/create");
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="cart-container">
      <h2>Ваш кошик</h2>

      {cartItems.length === 0 ? (
        <div>
          <p className="empty-cart">Ваш кошик порожній.</p>
          <a href="/" className="go-shopping">Продовжити покупки</a>
        </div>
      ) : (
        <div>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.product_id} className="cart-item">
                <img src={`/images/${item.image_url}`} alt={item.name} className="product-image" />
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p>{item.price} грн</p>
                </div>
                <div className="cart-item-actions">
                  <button onClick={() => updateCartItem(item.product_id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateCartItem(item.product_id, item.quantity + 1)}>+</button>
                  <button onClick={() => removeFromCart(item.product_id)} className="remove-btn">
                    <FaTrash /> 
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-total">
            <p>Загальна сума: {calculateTotal()} грн</p>
          </div>
          <button className="checkout-button" onClick={handleClick}>
            Перейти до оформлення
          </button>
          {/* <button className="clear-cart" onClick={() => clearCart()}>Очистити кошик</button> */}
        </div>
      )}
    </div>
  );
};

export default CartPage;
