// backend/controllers/adminController.js
import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import  sendEmail  from '../config/sendEmail.js'; // Assuming you have a utility function to send emails

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
    // Get three latest users with their creation time
    const latestUsersResult = await pool.query(`
      SELECT fullname, 
             created_at,
             to_char(created_at, 'HH12:MI AM') as time,
             to_char(created_at, 'Mon DD, YYYY') as date
      FROM users 
      ORDER BY id DESC 
      LIMIT 3
    `);
    const latestUsers = latestUsersResult.rows.map(row => ({
      fullname: row.fullname,
      time: row.time,
      date: row.date,
      created_at: row.created_at
    }));
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

export const sendAnouncement = async (req, res) => {
  try {
    const { subject, emailBody } = req.body;

    // Validate input
    if (!subject || !emailBody) {
      return res.status(400).json({ 
        success: false, 
        message: 'Subject and email body are required.' 
      });
    }

    // Get all user emails from the database
    const result = await pool.query('SELECT email FROM users');
    const userEmails = result.rows.map(row => row.email);

    if (userEmails.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No users found in the database.'
      });
    }

    // Send email to all users
    await Promise.all(userEmails.map(email => 
      sendEmail({
        to: email,
        subject: subject,
        html: emailBody
      })
    ));

    res.json({
      success: true,
      message: `Announcement sent successfully to ${userEmails.length} users.`
    });
  } catch (err) {
    console.error('Error sending announcement:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while sending announcement',
      error: err.message
    });
  }
};

export const addAdmin = async (req, res) => {
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

export const updatePassword = async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    
    // Validate all required fields
    if (!email || !currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email, current password, and new password are required.' 
      });
    }

    // Find admin by email
    const result = await pool.query('SELECT * FROM admin WHERE email = $1', [email]);
    const admin = result.rows[0];
    
    if (!admin) {
      return res.status(404).json({ 
        success: false, 
        message: 'Admin not found with this email.' 
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Current password is incorrect.' 
      });
    }

    // Hash and update new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await pool.query(
      'UPDATE admin SET password = $1 WHERE email = $2', 
      [hashedNewPassword, email]
    );

    res.json({ 
      success: true, 
      message: 'Password updated successfully.' 
    });
  } catch (err) {
    console.error('Error updating password:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while updating password', 
      error: err.message 
    });
  }
};