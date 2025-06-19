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
