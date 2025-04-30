import { useState, useEffect } from "react";
import axios from "../../utils/axiosInstance";
import "../../styles/manage-orders.css";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    axios.get("/admin/orders")
      .then((response) => {
        setOrders(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setLoading(false);
      });
  }, []);

  const handleUpdateStatus = () => {
    axios.put(`/admin/orders/${orderId}/status`, { status })
      .then(() => {
        setOrders(orders.map((order) =>
          order.id === orderId ? { ...order, status } : order
        ));
        resetForm();
      })
      .catch((error) => {
        console.error("Error updating order status:", error);
      });
  };

  const resetForm = () => {
    setStatus("");
    setOrderId(null);
  };

  return (
    <div className="manage-orders">
      <h1>Управління замовленнями</h1>

      {loading ? (
        <p>Завантаження...</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Користувач</th>
                <th>Товари</th>
                <th>Загальна сума</th>
                <th>Оплата</th>
                <th>Доставка</th>
                <th>Адреса доставки</th>
                <th>Статус</th>
                <th>Дата створення</th>
                <th>Дія</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customerName} (ID: {order.user_id})</td>
                  <td>
                    <ul>
                      {order.products.map((product, idx) => (
                        <li key={idx}>
                          {product.name} — {product.quantity} шт. × {product.price} грн
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>{order.total_price} грн</td>
                  <td>{order.payment_method === "card_on_delivery" ? "Карткою" : "Готівкою"}</td>
                  <td>{order.delivery_method === "pickup" ? "Самовивіз" : 'Доставка'}</td>
                  <td>{order.delivery_address || ''}</td>
                  <td>{order.status}</td>
                  <td>{new Date(order.created_at).toLocaleString("uk-UA")}</td>
                  <td>
                    <button onClick={() => setOrderId(order.id)}>Оновити статус</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orderId && (
            <div className="update-status-form">
              <h2>Оновити статус замовлення №{orderId}</h2>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="">Оберіть статус</option>
                <option value="pending">Очікується</option>
                <option value="processing">Обробляється</option>
                <option value="shipped">Готове до видачі</option>
                <option value="completed">Отримано</option>
                <option value="cancelled">Скасовано</option>
              </select>
              <button onClick={handleUpdateStatus}>Оновити</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ManageOrders;
