import uuid from 'uuid/v4';
import pubsub from './helpers/pubsub';
import { createHash } from './helpers/common';
import db from './db';

const TYPE = [true, false];

// eslint-disable-next-line camelcase
exports.processPayment = async ({ data, callback_key, payment_token }) => {
  // assume need to hash the request, and send to payment gateway
  // hashed data need to send back to order app to verification as well
  // just lets assume :P
  const hash = createHash(data, payment_token);

  const result = await mockSendDetailsToPayment(data, payment_token);

  const createdPayment = await db.createPayment(
    result.request_id,
    result.payment_id,
    data.id,
    result.success ? 'confirmed' : 'declined',
    data.created_by,
    data.total_price,
    hash,
    data.currency,
  );

  pubsub.publish(
    callback_key,
    createdPayment,
  );
};

function randomStatus() {
  return TYPE[Math.floor(Math.random() * 2)];
}

function mockSendDetailsToPayment(data) { // eslint-disable-line no-unused-vars
  // data parameter just for mocking, not using it in the demo
  return new Promise((resolve) => {
    setTimeout(() => {
      const status = randomStatus();
      const paymentId = status ? uuid() : null;
      resolve({
        success: status,
        request_id: uuid(),
        payment_id: paymentId,
      });
    }, 3000);
  });
}
