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
  const [delivery_address, setDeliveryAddress] = useState('');


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
      const body = {
        payment_method: paymentMethod,
        delivery_method: deliveryMethod,
        ...(deliveryMethod === 'delivery' && { delivery_address }) // Якщо доставка, додаємо адресу
      };
  

      console.log('Запит на сервер:', body);
      // Надсилаємо запит на сервер
      await axios.post('/orders/create', body);
      
      // Очистка корзини після успішного створення замовлення
      localStorage.removeItem('cart');
      clearCart();
      
      // Перехід до сторінки з замовленнями
      navigate('/my-orders');
    } catch (err) {
      // Виведення помилки, якщо щось пішло не так
      setError(err.response?.data?.message || 'Щось пішло не так');
    }
  };
  

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * 1,
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
    onChange={e => {
      const value = e.target.value;
      setDeliveryMethod(value);
      if (value !== 'delivery') setDeliveryAddress('');
    }}
  >
    <option value="pickup">Самовивіз</option>
    <option value="delivery">Доставка</option>
  </select>
</div>

{deliveryMethod === 'delivery' && (
  <div className="checkout-field">
    <label className="checkout-label">Адреса доставки</label>
    <input
      type="text"
      className="checkout-input"
      value={delivery_address}
      onChange={e => setDeliveryAddress(e.target.value)}
      placeholder="Введіть адресу доставки"
    />
  </div>
)}

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
