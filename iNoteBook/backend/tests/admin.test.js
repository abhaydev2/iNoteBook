import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { insertAdmin, loginAdmin, logoutAdmin, getData, sendAnouncement, addAdmin, updatePassword } from '../controllers/adminController';
import sendEmail from '../config/sendEmail';
import pool from '../config/db';

// Mock the dependencies
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../config/sendEmail');
jest.mock('../config/db', () => ({
  query: jest.fn()
}));

describe('Admin Controller Tests', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      body: {},
      cookies: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
      clearCookie: jest.fn()
    };
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('insertAdmin', () => {
    it('should insert a new admin successfully', async () => {
      mockReq.body = {
        email: 'admin@test.com',
        password: 'password123'
      };

      bcrypt.hash.mockResolvedValue('hashedPassword');
      pool.query.mockResolvedValue({
        rows: [{ id: 1, email: 'admin@test.com' }]
      });

      await insertAdmin(mockReq, mockRes);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO admin (email, password) VALUES ($1, $2) RETURNING id, email',
        ['admin@test.com', 'hashedPassword']
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        admin: { id: 1, email: 'admin@test.com' }
      });
    });

    it('should handle duplicate admin error', async () => {
      mockReq.body = {
        email: 'admin@test.com',
        password: 'password123'
      };

      pool.query.mockRejectedValue({ code: '23505' });

      await insertAdmin(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Admin already exists.'
      });
    });
  });

  describe('loginAdmin', () => {
    it('should login admin successfully', async () => {
      mockReq.body = {
        email: 'admin@test.com',
        password: 'password123'
      };

      pool.query.mockResolvedValue({
        rows: [{ id: 1, email: 'admin@test.com', password: 'hashedPassword' }]
      });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mockedToken');

      await loginAdmin(mockReq, mockRes);

      expect(mockRes.cookie).toHaveBeenCalledWith('admin_token', 'mockedToken', expect.any(Object));
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Login successful',
        redirect: '/dashboard'
      });
    });

    it('should handle invalid credentials', async () => {
      mockReq.body = {
        email: 'admin@test.com',
        password: 'wrongpassword'
      };

      pool.query.mockResolvedValue({ rows: [] });

      await loginAdmin(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid credentials.'
      });
    });
  });

  describe('logoutAdmin', () => {
    it('should logout admin successfully', () => {
      logoutAdmin(mockReq, mockRes);

      expect(mockRes.clearCookie).toHaveBeenCalledWith('admin_token');
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Logged out successfully.'
      });
    });
  });

  describe('getData', () => {
    it('should get dashboard data successfully', async () => {
      // Mock successful database queries
      pool.query.mockImplementation((query) => {
        if (query.includes('COUNT(*) FROM users')) {
          return { rows: [{ count: '10' }] };
        }
        if (query.includes('COUNT(*) FROM notes')) {
          return { rows: [{ count: '50' }] };
        }
        if (query.includes('date_trunc')) {
          return { rows: [{ this_month: '20', last_month: '10' }] };
        }
        if (query.includes('DISTINCT user_id')) {
          return { rows: [{ count: '5' }] };
        }
        if (query.includes('SELECT to_char')) {
          return { rows: [{ month: 'Jan', users: 0, notes: 15 }] };
        }
        if (query.includes('SELECT fullname')) {
          return { 
            rows: [{
              fullname: 'Test User',
              time: '10:00 AM',
              date: 'Jul 30, 2025',
              created_at: new Date()
            }]
          };
        }
        return { rows: [] };
      });

      await getData(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        totalUsers: expect.any(Number),
        totalNotes: expect.any(Number),
        growthRate: expect.any(String),
        activeUsers: expect.any(Number),
        chartData: expect.any(Array),
        latestUsers: expect.any(Array)
      }));
    });
  });

  describe('sendAnouncement', () => {
    it('should send announcement to all users successfully', async () => {
      mockReq.body = {
        subject: 'Test Announcement',
        emailBody: 'Test email body'
      };

      pool.query.mockResolvedValue({
        rows: [
          { email: 'user1@test.com' },
          { email: 'user2@test.com' }
        ]
      });

      sendEmail.mockResolvedValue(true);

      await sendAnouncement(mockReq, mockRes);

      expect(sendEmail).toHaveBeenCalledTimes(2);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: expect.stringContaining('Announcement sent successfully')
      });
    });

    it('should handle empty user list', async () => {
      mockReq.body = {
        subject: 'Test Announcement',
        emailBody: 'Test email body'
      };

      pool.query.mockResolvedValue({ rows: [] });

      await sendAnouncement(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'No users found in the database.'
      });
    });
  });

  describe('updatePassword', () => {
    it('should update admin password successfully', async () => {
      mockReq.body = {
        email: 'admin@test.com',
        currentPassword: 'oldpassword',
        newPassword: 'newpassword'
      };

      pool.query.mockImplementation((query) => {
        if (query.includes('SELECT')) {
          return {
            rows: [{ id: 1, email: 'admin@test.com', password: 'hashedOldPassword' }]
          };
        }
        return { rows: [] };
      });

      bcrypt.compare.mockResolvedValue(true);
      bcrypt.hash.mockResolvedValue('hashedNewPassword');

      await updatePassword(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Password updated successfully.'
      });
    });

    it('should handle incorrect current password', async () => {
      mockReq.body = {
        email: 'admin@test.com',
        currentPassword: 'wrongpassword',
        newPassword: 'newpassword'
      };

      pool.query.mockResolvedValue({
        rows: [{ id: 1, email: 'admin@test.com', password: 'hashedOldPassword' }]
      });

      bcrypt.compare.mockResolvedValue(false);

      await updatePassword(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Current password is incorrect.'
      });
    });
  });
});
