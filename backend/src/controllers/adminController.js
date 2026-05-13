import prisma from '../utils/prisma.js';

export const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            include: {
                _count: {
                    select: { proxies: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUserBalance = async (req, res) => {
    try {
        const { userId, amount, type } = req.body; // type: 'add' or 'set'

        const updateData = type === 'add' 
            ? { balance: { increment: amount } }
            : { balance: amount };

        const user = await prisma.user.update({
            where: { id: userId },
            data: updateData
        });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSystemStats = async (req, res) => {
    try {
        const userCount = await prisma.user.count();
        const proxyCount = await prisma.proxy.count();
        const activeProxyCount = await prisma.proxy.count({ where: { status: 'active' } });
        const totalRevenue = await prisma.payment.aggregate({
            _sum: { amount: true },
            where: { status: 'completed' }
        });

        res.json({
            users: userCount,
            proxies: proxyCount,
            activeProxies: activeProxyCount,
            revenue: totalRevenue._sum.amount || 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllProxies = async (req, res) => {
    try {
        const proxies = await prisma.proxy.findMany({
            include: { user: { select: { email: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json(proxies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addProxiesBulk = async (req, res) => {
    try {
        // Format expected: [{ proxyIp, port, username, password, type, country }]
        const { proxies } = req.body;
        
        if (!Array.isArray(proxies) || proxies.length === 0) {
            return res.status(400).json({ message: 'Invalid proxies array' });
        }

        const created = await prisma.proxy.createMany({
            data: proxies.map(p => ({
                proxyIp: p.proxyIp,
                port: parseInt(p.port),
                username: p.username,
                password: p.password,
                type: p.type || 'http',
                country: p.country || 'Unknown',
                status: 'active'
            }))
        });

        res.json({ message: `Successfully added ${created.count} proxies`, count: created.count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

import { HttpProxyAgent } from 'http-proxy-agent';
import axios from 'axios';

export const checkProxyHealth = async (req, res) => {
    try {
        const { id } = req.params;
        const proxy = await prisma.proxy.findUnique({ where: { id } });
        
        if (!proxy) return res.status(404).json({ message: 'Proxy not found' });

        const proxyUrl = `http://${proxy.username}:${proxy.password}@${proxy.proxyIp}:${proxy.port}`;
        const agent = new HttpProxyAgent(proxyUrl);
        
        const startTime = Date.now();
        try {
            // Check against an IP geolocation API to verify working status and get country
            const response = await axios.get('http://ip-api.com/json', {
                httpAgent: agent,
                timeout: 10000 // 10 seconds timeout
            });
            
            const latency = Date.now() - startTime;
            const country = response.data.country || 'Unknown';
            
            const updated = await prisma.proxy.update({
                where: { id },
                data: { status: 'active', latency, country }
            });
            
            res.json({ message: 'Proxy is alive', proxy: updated });
        } catch (checkError) {
            // Proxy failed
            const updated = await prisma.proxy.update({
                where: { id },
                data: { status: 'disabled', latency: null }
            });
            res.json({ message: 'Proxy is dead or unreachable', proxy: updated });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
