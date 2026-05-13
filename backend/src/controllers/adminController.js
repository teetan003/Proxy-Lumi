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
