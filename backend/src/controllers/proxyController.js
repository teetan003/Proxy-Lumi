import prisma from '../utils/prisma.js';
import { regenerate3Proxy } from '../services/proxyService.js';

export const createProxy = async (req, res) => {
    try {
        const { count, days } = req.body;
        const userId = req.user.id;

        // In a real scenario, you'd check balance here
        // and assign available IPs from a pool.
        // For this demo, we'll create dummy proxies.

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + (days || 30));

        const proxies = [];
        for (let i = 0; i < (count || 1); i++) {
            const proxy = await prisma.proxy.create({
                data: {
                    proxyIp: '45.1.1.1', // Placeholder
                    port: 30000 + Math.floor(Math.random() * 10000),
                    username: `user_${Math.random().toString(36).substring(7)}`,
                    password: Math.random().toString(36).substring(7),
                    expiresAt,
                    assignedTo: userId,
                    status: 'active'
                }
            });
            proxies.push(proxy);
        }

        await regenerate3Proxy();

        res.status(201).json(proxies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const listProxies = async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;

        let proxies;
        if (role === 'admin') {
            proxies = await prisma.proxy.findMany({
                include: { user: { select: { email: true } } }
            });
        } else {
            proxies = await prisma.proxy.findMany({
                where: { assignedTo: userId }
            });
        }

        res.json(proxies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteProxy = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const role = req.user.role;

        const proxy = await prisma.proxy.findUnique({ where: { id } });
        if (!proxy) return res.status(404).json({ message: 'Proxy not found' });

        if (role !== 'admin' && proxy.assignedTo !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await prisma.proxy.delete({ where: { id } });
        await regenerate3Proxy();

        res.json({ message: 'Proxy deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const renewProxy = async (req, res) => {
    try {
        const { id } = req.params;
        const { days } = req.body;
        
        const proxy = await prisma.proxy.findUnique({ where: { id } });
        if (!proxy) return res.status(404).json({ message: 'Proxy not found' });

        const newExpiresAt = new Date(proxy.expiresAt || new Date());
        newExpiresAt.setDate(newExpiresAt.getDate() + (days || 30));

        const updatedProxy = await prisma.proxy.update({
            where: { id },
            data: { expiresAt: newExpiresAt, status: 'active' }
        });

        await regenerate3Proxy();

        res.json(updatedProxy);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
