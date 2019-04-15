import {
  param,
} from 'express-validator/check';

import {
  findOrderById,
} from '../db';
import {
  success,
  error,
} from '../helpers/message';

const idValidate = param('id').exists();

exports.validation = [
  idValidate,
];

exports.handler = async (req, res) => {
  const { params } = req;

  const order = await findOrderById(params.id);

  if (!order) {
    return res.status(404).json(error('order_not_found', 'Order Not Found'));
  }

  return res.json(success(order));
};
