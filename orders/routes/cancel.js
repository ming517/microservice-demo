import {
  body,
} from 'express-validator/check';
import {
  success,
  error,
} from '../helpers/message';
import {
  cancelOrder,
  findOrderById,
} from '../db';

const ERR_ORDER_NOT_FOUND = 'order_not_found';
const ERR_ORDER_CANT_CANCEL = 'order_cant_cancel';

const orderIdValidate = body('id').exists().withMessage('is required');
const orderCancelReasonValidate = body('reason').isString().withMessage('need to be string format')
  .exists()
  .withMessage('is required');

exports.validation = [
  orderIdValidate,
  orderCancelReasonValidate,
];

// eslint-disable-next-line consistent-return
exports.handler = async (req, res) => {
  try {
    const {
      body, // eslint-disable-line no-shadow
      authedUser,
    } = req;
    const order = await findOrderById(body.id);

    if (order.status === 'cancelled') {
      return res.json(error(ERR_ORDER_CANT_CANCEL, 'Order already cancelled before'));
    }
    await cancelOrder(body.id, body.reason, authedUser);

    // assuming there is no refund if order cancelled
    return res.json(success({}));
  } catch (e) {
    if (e.message === ERR_ORDER_NOT_FOUND) {
      return res.json(error(ERR_ORDER_NOT_FOUND, 'Order not found'));
    }
  }
};
