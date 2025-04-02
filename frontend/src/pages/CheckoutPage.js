import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useCart } from "../context/CartContext";
import '../styles/checkout.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card_on_delivery');
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState('');
  const { clearCart } = useCart();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/cart", {
          withCredentials: true,
        });
        console.log('cartItems:', res.data);
        setCartItems(res.data || []);
      } catch (err) {
        console.error("Error fetching cart items:", err);
      }
    };
    fetchCartItems();
  }, []);  

  const handleOrder = async () => {
    try {
      await axios.post('/orders/create', {
        payment_method: paymentMethod,
        delivery_method: deliveryMethod,
      });
      localStorage.removeItem('cart');
      clearCart();
      navigate('/my-orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Щось пішло не так');
    }
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="checkout-container">
      <div className="checkout-box">
        <h2 className="checkout-title">Оформлення замовлення</h2>

        {error && <p className="checkout-error">{error}</p>}

        <div className="cart-items">
          <h3 className="cart-title">Ваше замовлення</h3>
          {(cartItems || []).length > 0 ? (
            cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <img
                  src={`/images/${item.image_url}`} 
                  alt={item.name}
                  className="cart-item-img"
                />
                <div className="cart-item-info">
                  <p className="cart-item-name">{item.name}</p>
                  <p className="cart-item-price">{item.price} грн</p>
                  <p className="cart-item-qty">Кількість: {item.quantity}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="cart-empty">Корзина порожня</p>
          )}
          {cartItems.length > 0 && (
            <div className="cart-item-price" style={{ marginTop: '0.5rem', fontWeight: '600' }}>
              Сума до оплати: {totalPrice} грн
            </div>
          )}
        </div>

        <div className="checkout-field">
          <label className="checkout-label">Спосіб оплати</label>
          <select
            className="checkout-select"
            value={paymentMethod}
            onChange={e => setPaymentMethod(e.target.value)}
          >
            <option value="card_on_delivery">Карткою при отриманні</option>
            <option value="cash_on_delivery">Готівкою при отриманні</option>
          </select>
        </div>

        <div className="checkout-field">
          <label className="checkout-label">Спосіб доставки</label>
          <select
            className="checkout-select"
            value={deliveryMethod}
            onChange={e => setDeliveryMethod(e.target.value)}
          >
            <option value="pickup">Самовивіз</option>
          </select>
        </div>

        <button
          onClick={handleOrder}
          className="checkout-button"
          disabled={cartItems.length === 0}
        >
          Підтвердити замовлення
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
