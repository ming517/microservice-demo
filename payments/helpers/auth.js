import {
  error as errMsg,
} from './message';

const FAKE_API_KEY = 'dummyapikey';
const HEADER_KEY = 'x-api-key';
const ERROR_KEY = 'auth_error';

const FAKE_USER = {
  id: 1,
  name: 'user',
};

// eslint-disable-next-line consistent-return
exports.auth = (req, res, next) => {
  const {
    headers,
  } = req;

  if (!headers[HEADER_KEY]) {
    return res.status(401).json(errMsg(
      ERROR_KEY,
      'missing api key',
    ));
  }

  if (headers[HEADER_KEY] !== FAKE_API_KEY) {
    return res.status(401).json(errMsg(
      ERROR_KEY,
      'unauthorized key',
    ));
  }

  req.authedUser = FAKE_USER;

  next();
};
