import {
  Router,
} from 'express';
import orderRoute from './order';
import healthRoute from './health';

const router = Router();

router.use('/health', healthRoute);
router.use('/orders', orderRoute);

module.exports = router;
