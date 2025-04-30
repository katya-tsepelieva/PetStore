import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import "../styles/my-orders.css";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const statusMap = {
    pending: 'Очікується',
    processing: 'Обробляється',
    shipped: 'Готове до видачі',
    completed: 'Отримано',
    cancelled: 'Скасовано',
  };


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get('/orders/my-orders');
        setOrders(res.data);
      } catch (err) {
        setError('Помилка при завантаженні замовлень');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const renderBadge = (text, type) => {
    return <span className={`badge ${type}`}>{text}</span>;
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2>Мої замовлення</h2>

      {loading && <p className="loading">Завантаження...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <>
          {orders.length === 0 ? (
            <p className="no-orders">Замовлень поки немає</p>
          ) : (
            orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <p><strong>Замовлення</strong></p>
                  {renderBadge(
                    statusMap[order.status] || 'Обробляється', 
                    order.status === 'completed' 
                    ? 'badge-success' 
                    : order.status === 'cancelled' 
                    ? 'badge-canceled' 
                    : order.status === 'pending' 
                    ? 'badge-pending' 
                    : order.status === 'processing' 
                    ? 'badge-processing'
                    : order.status === 'shipped' 
                    ? 'badge-shipped'
                    : 'badge-default' 
                  )}
                </div>

                <p><strong>Сума:</strong> {order.total_price} грн</p>

                <div className="badges-row">
                  {renderBadge(
                    order.payment_method === 'card_on_delivery' ? 'Карткою при отриманні' : 'Готівкою',
                    'badge-payment'
                  )}
                  {renderBadge(
                    order.delivery_method === 'pickup' ? 'Самовивіз' : 'Доставка',
                    'badge-delivery'
                  )}
                </div>

                <p><strong>Дата:</strong> {new Date(order.created_at).toLocaleString()}</p>

                <h4>Товари:</h4>
                <ul className="list-disc pl-6">
                  {order.items.map(item => (
                    <li key={item.id}>
                      {item.name} — {item.quantity} шт — {item.price} грн
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
};

export default MyOrdersPage;
