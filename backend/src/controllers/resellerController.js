import prisma from '../utils/prisma.js';

export const getResellerPricing = async (req, res) => {
    try {
        const userId = req.user.id;
        const pricing = await prisma.resellerPricing.findUnique({
            where: { userId }
        });
        res.json(pricing || { pricePerProxy: 50000 }); // Default price
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateResellerPricing = async (req, res) => {
    try {
        const { userId, pricePerProxy } = req.body;
        
        const pricing = await prisma.resellerPricing.upsert({
            where: { userId },
            update: { pricePerProxy },
            create: { userId, pricePerProxy }
        });

        res.json(pricing);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
