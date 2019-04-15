import axios from 'axios';
import {
  Router,
} from 'express';

const router = Router();

const checkHealth = async (url) => {
  try {
    await axios.get(url);
    // assume return results is healthy
    return true;
  } catch (e) {
    return false;
  }
};

router.get('/order', async (req, res) => res.json({
  healthy: await checkHealth(`${process.env.ORDER_API_HOST}/health`),
}));

router.get('/payment', async (req, res) => res.json({
  healhty: await checkHealth(`${process.env.PAYMENT_API_HOST}/health`),
}));

module.exports = router;
