import { Router } from 'express';
import * as authController from '../controllers/authController';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', auth, authController.logout);
router.post('/refresh', authController.refreshToken);

export default router;