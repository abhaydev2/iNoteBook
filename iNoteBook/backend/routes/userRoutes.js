import express from 'express';
import {
  signup,
  login,
  logout,
  sendResetPasswordEmail,
  resetPassword,
  deleteMyAccount
} from '../controllers/userController.js';
import { protect } from '../middleware/userMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/reset-password', sendResetPasswordEmail);
router.post('/reset-password/:token', resetPassword); // new route
router.post('/delete-my-account',protect,deleteMyAccount);

export default router;
