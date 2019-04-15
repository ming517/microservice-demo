import {
  body,
} from 'express-validator/check';
import debugLib from 'debug';
import {
  notEmptyArray,
} from '../helpers/customValidator';
import {
  createOrder,
  findOrderById,
  getOrderDeliverDelay,
  updateOrderToDelivered,
  updateOrderToConfirmed,
  cancelOrder,
} from '../db';
import {
  success,
} from '../helpers/message';
import {
  publish,
  subscribe,
  unsubscribe,
} from '../helpers/pubsub';
import {
  createHash,
} from '../helpers/common';

const debug = debugLib('orders:create-route');

const itemsValidate = body('items').isArray().withMessage('required array type')
  .custom(notEmptyArray)
  .withMessage('array cannot be empty')
  .exists()
  .withMessage('is required');

const itemIdValidate = body('items.*.id').exists().withMessage('is required');

const itemNameValidate = body('items.*.name').exists().withMessage('is required')
  .isString()
  .withMessage('need to be in string');

const itemDescriptionValidate = body('items.*.description').exists().withMessage('is required')
  .isString()
  .withMessage('need to be in string');

const itemQuantityValidate = body('items.*.quantity').isInt({
  min: 1,
})
  .withMessage('has to integer type and value minimum is 1')
  .exists()
  .withMessage('is required');

// price shouldnt pass via api, but it should retrieve from db.
// price is passing in this demo purpose
const itemUnitPriceValidate = body('items.*.unit_price').isFloat().withMessage('has to be float format')
  .exists()
  .withMessage('is required');

const itemTotalPriceValidate = body('items.*.total_price').isFloat().withMessage('has to be float format');

// hardcode currency time for demo
const CURRENCY = 'myr';

const PUB_PROCESS_PAYMENT = 'process-payment';
const SUB_PROCESS_PAYMENT_DONE = 'process-payment';

const FAKE_PAYMENT_TOKEN = '1234567890';

exports.validation = [
  itemsValidate,
  itemIdValidate,
  itemNameValidate,
  itemDescriptionValidate,
  itemQuantityValidate,
  itemUnitPriceValidate,
  itemTotalPriceValidate,
];

exports.handler = async (req, res) => {
  const {
    body, // eslint-disable-line no-shadow
    authedUser,
  } = req;

  const totalPrice = body.items.reduce((total, item) => total + item.total_price, 0);

  const createdOrder = await createOrder(
    body.items,
    totalPrice,
    CURRENCY,
    authedUser,
  );

  debug('order created');

  // eslint-disable-next-line no-use-before-define
  const callbackKey = getPaymentSubKey(createdOrder);

  publish(PUB_PROCESS_PAYMENT, {
    data: createdOrder,
    payment_token: FAKE_PAYMENT_TOKEN,
    callback_key: callbackKey,
  });

  // eslint-disable-next-line no-use-before-define
  subscribe(callbackKey, handlePaymentEvent(callbackKey));

  res.json(success(createdOrder));
};

const getPaymentSubKey = result => `${SUB_PROCESS_PAYMENT_DONE}-${result.id}`;

// eslint-disable-next-line arrow-parens
const handlePaymentEvent = (key) => async (paymentData) => {
  debug('payment callback received');
  const order = await findOrderById(paymentData.order_id);

  if (!order) {
    debug('order not found', paymentData.order_id);
    return;
  }

  // verify
  const hash = createHash(order, FAKE_PAYMENT_TOKEN);

  if (hash !== paymentData.hashed) {
    // do nothing for this demo :P
    debug('hash not match', paymentData.hashed);
    return;
  }

  if (paymentData.status === 'confirmed') {
    debug('payment confirmed');
    updateOrderToConfirmed(paymentData.order_id, paymentData.id);
    // eslint-disable-next-line no-use-before-define
    postProcessDeliver(paymentData.order_id);
  } else {
    debug('payment declined');
    cancelOrder(paymentData.order_id,
      'payment failed',
      // mock system user here
      {
        id: null,
        name: 'SYSTEM',
      });
  }

  unsubscribe(key);
};

async function postProcessDeliver(orderId) {
  const delay = await getOrderDeliverDelay();
  setTimeout(async () => {
    debug('process deliver', orderId);
    const order = await findOrderById(orderId);
    if (order && order.status === 'cancelled') {
      return;
    }
    await updateOrderToDelivered(orderId);
  }, delay);
}
