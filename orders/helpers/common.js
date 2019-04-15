import crypto from 'crypto';
import {
  validationResult,
} from 'express-validator/check';
import datefns from 'date-fns';
import {
  error as errMsg,
} from './message';

const ERROR_KEY = 'validation_error';

// eslint-disable-next-line consistent-return
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json(errMsg(
      ERROR_KEY,
      errors.array(),
    ));
  }
  next();
};

exports.now = () => datefns.format(new Date(), 'YYYY-MM-DD HH:mm:ss');

exports.createHash = (obj, token) => {
  const sortedObj = sortObject(obj);
  return crypto.createHmac('sha1', token).update(JSON.stringify(sortedObj)).digest('hex');
};

function sortObject(obj) {
  let orderedObj = {}; // eslint-disable-line prefer-const

  // eslint-disable-next-line arrow-parens
  Object.keys(obj).sort().forEach(key => {
    orderedObj[key] = obj[key];
  });

  return orderedObj;
}
