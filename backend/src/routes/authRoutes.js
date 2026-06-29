import { Router } from 'express';

import { login, me } from '../controllers/authController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = Router();

router
  .route('/login')
  .post(login);

router
  .route('/me')
  .get(authenticate, me);

export default router;
