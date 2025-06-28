// models/userModel.js
import pool from '../config/db.js';

export const createUser = async (fullname, email, hashedPassword) => {
  const result = await pool.query(
    'INSERT INTO users (fullname, email, password) VALUES ($1, $2, $3) RETURNING *',
    [fullname, email, hashedPassword]
  );
  return result.rows[0];
};

export const findUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

// Add this at the bottom of your existing file
export const updateUserResetToken = async (email, hashedToken, expires) => {
  await pool.query(
    'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3',
    [hashedToken, expires, email]
  );
};

export const findUserByResetToken = async (token) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE reset_token = $1',
    [token]
  );
  return result.rows[0];
};

export const updateUserPassword = async (userId, newHashedPassword) => {
  await pool.query(
    'UPDATE users SET password = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2',
    [newHashedPassword, userId]
  );
};