const db = require("../config/db");

exports.createOrder = async (req, res) => {
  const userId = req.user.id;
  const { payment_method, delivery_method, delivery_address } = req.body;

  if (!['card_on_delivery', 'cash_on_delivery'].includes(payment_method)) {
    return res.status(400).json({ message: 'Невірний спосіб оплати' });
  }

  if (!['pickup', 'delivery'].includes(delivery_method)) {
    return res.status(400).json({ message: 'Невірний спосіб доставки' });
  }

  if (delivery_method === 'delivery' && (!delivery_address || delivery_address.trim() === '')) {
    return res.status(400).json({ message: 'Необхідно вказати адресу доставки' });
  }

  try {
    const [cartItems] = await db.execute(
      'SELECT * FROM cart WHERE user_id = ?',
      [userId]
    );

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Кошик порожній' });
    }

    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.price * 1,
      0
    );

    const [orderResult] = await db.execute(
      'INSERT INTO orders (user_id, total_price, payment_method, delivery_method, delivery_address) VALUES (?, ?, ?, ?, ?)',
      [
        userId,
        totalPrice,
        payment_method,
        delivery_method,
        delivery_method === 'delivery' ? delivery_address : null
      ]
    );

    const orderId = orderResult.insertId;

    const insertItems = cartItems.map(item =>
      db.execute(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.price]
      )
    );

    await Promise.all(insertItems);

    await db.execute('DELETE FROM cart WHERE user_id = ?', [userId]);

    res.status(201).json({ message: 'Замовлення створено успішно!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};

exports.getMyOrders = async (req, res) => {
    const userId = req.user.id;
  
    try {
      const [orders] = await db.execute(
        'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
      );

      const ordersWithItems = await Promise.all(
        orders.map(async order => {
          const [items] = await db.execute(
            `SELECT oi.*, p.name, p.image_url FROM order_items oi
             JOIN products p ON oi.product_id = p.id
             WHERE oi.order_id = ?`,
            [order.id]
          );
          return { ...order, items };
        })
      );
  
      res.status(200).json(ordersWithItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
          message: 'Помилка сервера при отриманні замовлень', 
          error: error.message 
        });
      }      
  };
