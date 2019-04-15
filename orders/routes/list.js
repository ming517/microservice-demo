import { allOrders } from '../db'; // eslint-disable-line import/named
import { success } from '../helpers/message';

exports.handler = async (req, res) => {
  const orders = await allOrders();
  return res.json(success(orders));
};
