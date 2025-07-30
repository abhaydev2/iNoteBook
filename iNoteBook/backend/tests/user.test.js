import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { signup, login, logout, sendResetPasswordEmail, resetPassword, deleteMyAccount } from '../controllers/userController';
import { createUser, findUserByEmail, updateUserResetToken, findUserByResetToken, updateUserPassword, deleteUser } from '../models/userModel';
import sendEmail from '../config/sendEmail';

// Mock the dependencies
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../models/userModel');
jest.mock('../config/sendEmail');

describe('User Controller Tests', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      body: {},
      user: { id: 1 },
      cookies: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
      clearCookie: jest.fn()
    };
  });

  describe('signup', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        fullname: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };
      mockReq.body = userData;

      bcrypt.hash.mockResolvedValue('hashedPassword');
      createUser.mockResolvedValue({ id: 1, ...userData, password: 'hashedPassword' });
      jwt.sign.mockReturnValue('mockedToken');

      await signup(mockReq, mockRes);

      expect(createUser).toHaveBeenCalledWith(userData.fullname, userData.email, 'hashedPassword');
      expect(mockRes.cookie).toHaveBeenCalledWith('notes_token', 'mockedToken', expect.any(Object));
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        message: 'User registered successfully'
      }));
    });

    it('should return error if user already exists', async () => {
      mockReq.body = {
        fullname: 'Test User',
        email: 'existing@example.com',
        password: 'password123'
      };

      findUserByEmail.mockResolvedValue({ id: 1 });

      await signup(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'User already exists' });
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      mockReq.body = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        fullname: 'Test User'
      };

      findUserByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mockedToken');

      await login(mockReq, mockRes);

      expect(mockRes.cookie).toHaveBeenCalledWith('notes_token', 'mockedToken', expect.any(Object));
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        message: 'Login successful'
      }));
    });

    it('should return error for invalid credentials', async () => {
      mockReq.body = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      findUserByEmail.mockResolvedValue(null);

      await login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      await logout(mockReq, mockRes);

      expect(mockRes.clearCookie).toHaveBeenCalledWith('notes_token', expect.any(Object));
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Logged out successfully'
      });
    });
  });

  describe('sendResetPasswordEmail', () => {
    it('should send reset password email successfully', async () => {
      mockReq.body = { email: 'test@example.com' };
      const mockUser = { id: 1, email: 'test@example.com' };

      findUserByEmail.mockResolvedValue(mockUser);
      updateUserResetToken.mockResolvedValue(true);
      sendEmail.mockResolvedValue(true);

      await sendResetPasswordEmail(mockReq, mockRes);

      expect(sendEmail).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Password reset email sent'
      });
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully', async () => {
      mockReq.params = { token: 'validtoken' };
      mockReq.body = { password: 'newpassword123' };

      const mockUser = { id: 1, email: 'test@example.com' };
      findUserByResetToken.mockResolvedValue(mockUser);
      bcrypt.hash.mockResolvedValue('newhashpassword');
      updateUserPassword.mockResolvedValue(true);

      await resetPassword(mockReq, mockRes);

      expect(updateUserPassword).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Password has been reset successfully'
      });
    });
  });

  describe('deleteMyAccount', () => {
    it('should delete user account successfully', async () => {
      deleteUser.mockResolvedValue(true);

      await deleteMyAccount(mockReq, mockRes);

      expect(deleteUser).toHaveBeenCalledWith(1);
      expect(mockRes.clearCookie).toHaveBeenCalledWith('notes_token', expect.any(Object));
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Account deleted successfully'
      });
    });
  });
});
