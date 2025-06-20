// controllers/userController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail } from '../models/userModel.js';
import dotenv from 'dotenv';

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
