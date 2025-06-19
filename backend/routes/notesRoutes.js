// routes/notesRoutes.js
import express from 'express';
import { create, edit, remove } from '../controllers/notesController.js';
import { protect } from '../middleware/userMiddleware.js';
const router = express.Router();

router.post('/create', protect, create);
router.put('/edit/:id', protect, edit);
router.delete('/delete/:id', protect, remove);

export default router;
