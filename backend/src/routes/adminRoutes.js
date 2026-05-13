import express from 'express';
import { getAllUsers, updateUserBalance, getSystemStats } from '../controllers/adminController.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(auth, adminAuth);

router.get('/users', getAllUsers);
router.post('/users/balance', updateUserBalance);
router.get('/stats', getSystemStats);

export default router;
