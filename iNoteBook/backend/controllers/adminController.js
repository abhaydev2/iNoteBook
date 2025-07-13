// backend/controllers/adminController.js
import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// 1. Insert Admin
export const insertAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO admin (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );
    res.status(201).json({ success: true, admin: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ success: false, message: 'Admin already exists.' });
    }
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// 2. Login Admin
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }
    const result = await pool.query('SELECT * FROM admin WHERE email = $1', [email]);
    const admin = result.rows[0];
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }
    // Use JWT or dummy token
    const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET || 'dummysecret', { expiresIn: '1d' });
    
    res.cookie('admin_token', token, {
    //   httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    });
    res.json({ success: true, message: 'Login successful', redirect: '/dashboard' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// 3. Logout Admin
export const logoutAdmin = (req, res) => {
  res.clearCookie('admin_token');
  res.json({ success: true, message: 'Logged out successfully.' });
};

// 4. Get Data for Dashboard
export const getData = async (req, res) => {
  try {
    // Total users
    const usersResult = await pool.query('SELECT COUNT(*) FROM users');
    const totalUsers = parseInt(usersResult.rows[0].count, 10);
    // Total notes
    const notesResult = await pool.query('SELECT COUNT(*) FROM notes');
    const totalNotes = parseInt(notesResult.rows[0].count, 10);
    // Growth rate (notes this month vs last month)
    const growthResult = await pool.query(`
      SELECT
        COALESCE(SUM(CASE WHEN date_trunc('month', created_at) = date_trunc('month', CURRENT_DATE) THEN 1 ELSE 0 END),0) AS this_month,
        COALESCE(SUM(CASE WHEN date_trunc('month', created_at) = date_trunc('month', CURRENT_DATE - INTERVAL '1 month') THEN 1 ELSE 0 END),0) AS last_month
      FROM notes
    `);
    const thisMonth = parseInt(growthResult.rows[0].this_month, 10);
    const lastMonth = parseInt(growthResult.rows[0].last_month, 10);
    let growthRate = '0%';
    if (lastMonth > 0) {
      growthRate = (((thisMonth - lastMonth) / lastMonth) * 100).toFixed(2) + '%';
    } else if (thisMonth > 0) {
      growthRate = '100%';
    }
    // Active users (last 7 days)
    const activeResult = await pool.query(
      `SELECT COUNT(DISTINCT user_id) FROM notes WHERE created_at >= NOW() - INTERVAL '7 days'`
    );
    const activeUsers = parseInt(activeResult.rows[0].count, 10);
    // Chart data (users by signup month is not possible, so only notes by month)
    const chartResult = await pool.query(`
      SELECT to_char(date_trunc('month', created_at), 'Mon') AS month,
             0 AS users,
             COUNT(*) AS notes
      FROM notes
      GROUP BY date_trunc('month', created_at)
      ORDER BY date_trunc('month', created_at)
    `);
    const chartData = chartResult.rows;
    // Get two latest users by id
    const latestUsersResult = await pool.query('SELECT fullname FROM users ORDER BY id DESC LIMIT 2');
    const latestUsers = latestUsersResult.rows.map(row => row.fullname);
    res.json({
      totalUsers,
      totalNotes,
      growthRate,
      activeUsers,
      chartData,
      latestUsers
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
