// models/notesModel.js
import pool from '../config/db.js';

export const getNotesByUserId = async (userId) => {
  const result = await pool.query(
    'SELECT * FROM notes WHERE user_id = $1 ',
    [userId]
  );
  return result.rows;
};

export const createNote = async (userId, title, description, category) => {
  const result = await pool.query(
    'INSERT INTO notes (user_id, title, description, category) VALUES ($1, $2, $3, $4) RETURNING *',
    [userId, title, description, category]
  );
  return result.rows[0];
};

export const updateNote = async (noteId, title, description, category) => {
  const result = await pool.query(
    'UPDATE notes SET title = $1, description = $2, category = $3 WHERE id = $4 RETURNING *',
    [title, description, category, noteId]
  );
  return result.rows[0];
};

export const deleteNote = async (noteId) => {
  await pool.query('DELETE FROM notes WHERE id = $1', [noteId]);
};
