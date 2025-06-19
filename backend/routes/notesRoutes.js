// routes/notesRoutes.js
import express from 'express';
import { create, edit, remove } from '../controllers/notesController.js';
import { protect } from '../middleware/userMiddleware.js';
const router = express.Router();

router.post('/', protect, create);
router.put('/:id', protect, edit);
router.delete('/:id', protect, remove);

export default router;
