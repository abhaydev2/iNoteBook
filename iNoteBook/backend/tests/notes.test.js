import { create, edit, remove, getNotes } from '../controllers/notesController';
import { createNote, updateNote, deleteNote, getNotesByUserId } from '../models/notesModel';

// Mock the dependencies
jest.mock('../models/notesModel');

describe('Notes Controller Tests', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      body: {},
      user: { id: 1 },
      params: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('create', () => {
    it('should create a note successfully', async () => {
      const noteData = {
        title: 'Test Note',
        description: 'Test Description',
        category: 'Test Category'
      };
      mockReq.body = noteData;

      const mockCreatedNote = {
        id: 1,
        user_id: 1,
        ...noteData
      };

      createNote.mockResolvedValue(mockCreatedNote);

      await create(mockReq, mockRes);

      expect(createNote).toHaveBeenCalledWith(1, noteData.title, noteData.description, noteData.category);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockCreatedNote);
    });

    it('should return error if required fields are missing', async () => {
      mockReq.body = {
        title: 'Test Note'
        // missing description and category
      };

      await create(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'All fields are required'
      });
    });
  });

  describe('edit', () => {
    it('should update a note successfully', async () => {
      const noteData = {
        title: 'Updated Note',
        description: 'Updated Description',
        category: 'Updated Category'
      };
      mockReq.body = noteData;
      mockReq.params = { id: '1' };

      const mockUpdatedNote = {
        id: 1,
        user_id: 1,
        ...noteData
      };

      updateNote.mockResolvedValue(mockUpdatedNote);

      await edit(mockReq, mockRes);

      expect(updateNote).toHaveBeenCalledWith('1', noteData.title, noteData.description, noteData.category);
      expect(mockRes.json).toHaveBeenCalledWith(mockUpdatedNote);
    });

    it('should return error if required fields are missing', async () => {
      mockReq.body = {
        title: 'Updated Note'
        // missing description and category
      };
      mockReq.params = { id: '1' };

      await edit(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'All fields are required'
      });
    });
  });

  describe('remove', () => {
    it('should delete a note successfully', async () => {
      mockReq.params = { id: '1' };

      deleteNote.mockResolvedValue(true);

      await remove(mockReq, mockRes);

      expect(deleteNote).toHaveBeenCalledWith('1');
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Note deleted'
      });
    });

    it('should handle deletion error', async () => {
      mockReq.params = { id: '1' };

      const error = new Error('Deletion failed');
      deleteNote.mockRejectedValue(error);

      await remove(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: error.message
      });
    });
  });

  describe('getNotes', () => {
    it('should get all notes for a user successfully', async () => {
      const mockNotes = [
        { id: 1, title: 'Note 1', description: 'Desc 1', category: 'Cat 1' },
        { id: 2, title: 'Note 2', description: 'Desc 2', category: 'Cat 2' }
      ];

      getNotesByUserId.mockResolvedValue(mockNotes);

      await getNotes(mockReq, mockRes);

      expect(getNotesByUserId).toHaveBeenCalledWith(1);
      expect(mockRes.json).toHaveBeenCalledWith(mockNotes);
    });

    it('should handle error when getting notes', async () => {
      const error = new Error('Failed to get notes');
      getNotesByUserId.mockRejectedValue(error);

      await getNotes(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: error.message
      });
    });
  });
});
