// controllers/notesController.js
import { createNote, updateNote, deleteNote, getNotesByUserId } from '../models/notesModel.js';

export const create = async (req, res) => {
  const { title, description, category } = req.body;
  if (!title || !description || !category) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    const note = await createNote(req.user.id, title, description, category);
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const edit = async (req, res) => {
  const { id } = req.params;
  const { title, description, category } = req.body;
  if (!title || !description || !category) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const note = await updateNote(id, title, description, category);
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const remove = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteNote(id);
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(50).json({ message: err.message });
  }
};

export const getNotes = async (req, res) => {
  try {
    const notes = await getNotesByUserId(req.user.id);
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};