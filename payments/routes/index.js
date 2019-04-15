import { Router } from 'express';

const router = Router();

router.get('/health', (req, res) => res.json({ success: true }));

module.exports = router;
