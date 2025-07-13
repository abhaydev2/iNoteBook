// controllers/userController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail } from '../models/userModel.js';
import dotenv from 'dotenv';
import crypto from 'crypto';
import {
  updateUserResetToken,
  findUserByResetToken,
  updateUserPassword,
  deleteUser,
} from '../models/userModel.js';
import sendEmail from '../config/sendEmail.js'; // you’ll create this file
dotenv.config();

export const signup = async (req, res) => {
  const { fullname, email, password } = req.body;
  if (!fullname || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser(fullname, email, hashedPassword);

    // Generate JWT token after signup
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.cookie('notes_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: { id: user.id, fullname: user.fullname, email: user.email }
    });
  } catch (err) {
    res.status(500).json({success:false, error: 'Server error: Signup Failled' + err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
console.log(token);
    res.cookie('notes_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: 'Login successful',
      user: { id: user.id, fullname: user.fullname, email: user.email },
    });
  } catch (err) {
    res.status(500).json({success:false, error: 'Server error: Login Failled ' + err.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie('notes_token', {
    httpOnly: true,
    sameSite: 'Strict',
    secure: process.env.NODE_ENV === 'production',
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

export const sendResetPasswordEmail = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await updateUserResetToken(user.email, hashedToken, expires);

    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendEmail({
      to: email,
      subject: 'iNoteBook Password Reset',
      html: `
        <p>Click the link below to reset your password:</p>
        <a href="${resetURL}">${resetURL}</a>
        <p>This link is valid for 15 minutes only.</p>
      `
    });

    res.json({ success: true, message: 'Password reset email sent' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send reset email: ' + err.message });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!token || !password) return res.status(400).json({ error: 'Token and password required' });

  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await findUserByResetToken(hashedToken);

    if (!user || user.reset_token_expires < new Date()) {
      return res.status(400).json({ error: 'Token is invalid or expired' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await updateUserPassword(user.id, hashedPassword);

    res.json({ success: true, message: 'Password has been reset successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Password reset failed: ' + err.message });
  }
};

export const deleteMyAccount = async (req, res) =>{
  try {
    const userId = req.user.id; // Getting user id from middleware
    
    // Delete the user account
    const deletedUser = await deleteUser(userId);
    
    if (!deletedUser) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Clear the authentication cookie
    res.clearCookie('notes_token', {
      httpOnly: true,
      sameSite: 'Strict',
      secure: process.env.NODE_ENV === 'production',
    });

    res.json({ 
      success: true, 
      message: 'Account deleted successfully' 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete account: ' + err.message 
    });
  }
};