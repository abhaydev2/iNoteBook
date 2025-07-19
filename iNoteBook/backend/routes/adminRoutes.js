import express from 'express';
import { insertAdmin, loginAdmin, logoutAdmin, getData, sendAnouncement } from '../controllers/adminController.js';

const router = express.Router();

// POST /api/admin/register
router.post('/register', insertAdmin);

// POST /api/admin/login
router.post('/login', loginAdmin);

// POST /api/admin/logout
router.post('/logout', logoutAdmin);

// GET /api/admin/dashboard-data
router.get('/dashboard-data', getData);

router.post('/send-announcement', sendAnouncement);

export default router;
