import uuid from 'uuid/v1';
import {
  now,
} from '../helpers/common';

const ORDERS = [];

const DELAY = 1 * 1000;

let orderDeliverDelay = 5000; // default

const mockAsync = cb => new Promise((resolve) => {
  setTimeout(() => resolve(cb()), DELAY);
});

const createOrder = (items, totalPrice, currency, user) => {
  const order = {
    id: uuid(),
    total_price: totalPrice,
    currency,
    items,
    status: 'created',
    created_by: user,
    created_at: now(),
    updated_at: now(),
  };

  ORDERS.push(order);

  return mockAsync(() => order);
};

const allOrders = () => mockAsync(() => ORDERS.slice().reverse());

const findOrderById = id => mockAsync(() => ORDERS.find(order => order.id === id));

const cancelOrder = async (id, reason, user) => {
  const order = await findOrderById(id);
  if (!order) {
    throw new Error('order_not_found');
  }

  order.status = 'cancelled';
  order.reason = reason;
  order.cancel_by = user;
  order.updated_at = now();
  order.cancel_at = now();

  await updateOrder(order);

  return order;
};

const updateOrderToDelivered = async (orderId) => {
  const order = await findOrderById(orderId);
  order.status = 'delivered';
  order.updated_at = now();

  await updateOrder(order);

  return order;
};

const updateOrderToConfirmed = async (orderId, paymentId) => {
  const order = await findOrderById(orderId);
  order.status = 'confirmed';
  order.payment_id = paymentId;
  order.updated_at = now();

  await updateOrder(order);

  return order;
};

const updateOrder = order => mockAsync(() => {
  for (let i = 0; i < ORDERS.length; i++) {
    const _order = ORDERS[i];
    if (_order.id === order.id) {
      _order.updated_at = now();
      ORDERS[i] = _order;
      break;
    }
  }
  return true;
});

const updateOrderDeliverDelay = millisecond => mockAsync(() => {
  orderDeliverDelay = millisecond;
});

const getOrderDeliverDelay = () => mockAsync(() => orderDeliverDelay);

module.exports = {
  createOrder,
  allOrders,
  findOrderById,
  cancelOrder,
  updateOrder,
  updateOrderDeliverDelay,
  getOrderDeliverDelay,
  updateOrderToDelivered,
  updateOrderToConfirmed,
};
