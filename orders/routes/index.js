import { Router } from 'express';
import listRoute from './list';
import createRoute from './create';
import cancelRoute from './cancel';
import getRoute from './get';

import { handleValidationErrors } from '../helpers/common';
import { auth } from '../helpers/auth';

const router = Router();

router.get('/',
  auth,
  listRoute.handler);

router.get('/health', (req, res) => res.json({ success: true }));

router.get(
  '/details/:id',
  auth,
  getRoute.validation,
  handleValidationErrors,
  getRoute.handler,
);

router.post(
  '/create',
  auth,
  createRoute.validation,
  handleValidationErrors,
  createRoute.handler,
);

router.post(
  '/cancel',
  auth,
  cancelRoute.validation,
  handleValidationErrors,
  cancelRoute.handler,
);

module.exports = router;
