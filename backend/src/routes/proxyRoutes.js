import express from 'express';
import { createProxy, listProxies, deleteProxy, renewProxy } from '../controllers/proxyController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

router.post('/create', createProxy);
router.get('/', listProxies);
router.delete('/:id', deleteProxy);
router.post('/:id/renew', renewProxy);

export default router;
