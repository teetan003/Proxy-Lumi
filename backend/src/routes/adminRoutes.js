import express from 'express';
import { getAllUsers, updateUserBalance, getSystemStats, getAllProxies, addProxiesBulk, checkProxyHealth } from '../controllers/adminController.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(auth, adminAuth);

router.get('/users', getAllUsers);
router.post('/users/balance', updateUserBalance);
router.get('/stats', getSystemStats);

// Proxy management
router.get('/proxies', getAllProxies);
router.post('/proxies/bulk', addProxiesBulk);
router.post('/proxies/:id/check', checkProxyHealth);

export default router;
