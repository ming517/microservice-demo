import { Router } from 'express';
import gateway from '../helpers/gateway';

const router = Router();

router.get('/', (req, res) => gateway.get(`${process.env.ORDER_API_HOST}`, req, res));
router.get('/details/:id', (req, res) => gateway.get(`${process.env.ORDER_API_HOST}/details/${req.params.id}`, req, res));
router.post('/create', (req, res) => gateway.post(`${process.env.ORDER_API_HOST}/create`, req, res));
router.post('/cancel', (req, res) => gateway.post(`${process.env.ORDER_API_HOST}/cancel`, req, res));

module.exports = router;
