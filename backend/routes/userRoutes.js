import express from 'express';
import {
  signup,
  login,
  logout,
  sendResetPasswordEmail,
  resetPassword,
} from '../controllers/userController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/reset-password', sendResetPasswordEmail);
router.post('/reset-password/:token', resetPassword); // new route

export default router;
