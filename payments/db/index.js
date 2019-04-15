// mock db
import uuid from 'uuid/v1';
import { now } from '../helpers/common';

const PAYMENTS = [];

const DELAY = 1 * 1000;

const mockAsync = cb => new Promise((resolve) => { setTimeout(() => resolve(cb()), DELAY); });

exports.createPayment = (
  requestId,
  paymentId,
  orderId,
  status,
  user,
  paidAmount,
  hashed,
  currency,
) => {
  const payment = {
    id: uuid(),
    request_id: requestId,
    payment_id: paymentId,
    order_id: orderId,
    status,
    user,
    paid_amount: paidAmount,
    currency,
    hashed,
    created_at: now(),
    updated_at: now(),
  };

  PAYMENTS.push(payment);

  return mockAsync(() => payment);
};
