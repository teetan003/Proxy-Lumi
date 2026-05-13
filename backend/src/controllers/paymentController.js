import prisma from '../utils/prisma.js';

export const createPayment = async (req, res) => {
    try {
        const { amount, provider } = req.body;
        const userId = req.user.id;

        // In a real scenario, you'd call a provider's API (e.g., PayOS, Casso for VietQR)
        // For this demo, we'll simulate a VietQR payment request.
        
        const transactionId = `TXN_${Math.random().toString(36).substring(7).toUpperCase()}`;
        
        const payment = await prisma.payment.create({
            data: {
                userId,
                amount,
                provider,
                status: 'pending',
                transactionId
            }
        });

        // Simulating a VietQR payload
        // Format: https://img.vietqr.io/image/<BANK_ID>-<ACCOUNT_NO>-<TEMPLATE>.png?amount=<AMOUNT>&addInfo=<DESCRIPTION>&accountName=<NAME>
        const qrUrl = `https://img.vietqr.io/image/970422-123456789-compact.png?amount=${amount}&addInfo=${transactionId}&accountName=PROXYPLATFORM`;

        res.status(201).json({
            payment,
            qrUrl,
            message: 'Please scan the QR code to complete payment'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const payment = await prisma.payment.findUnique({ where: { id } });
        
        if (!payment) return res.status(404).json({ message: 'Payment not found' });
        
        res.json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Webhook for payment provider
export const handleWebhook = async (req, res) => {
    // This would be called by the payment provider (VietQR service like Casso/PayOS)
    const { transactionId, status } = req.body;

    try {
        const payment = await prisma.payment.findFirst({ where: { transactionId } });
        
        if (payment && status === 'completed') {
            await prisma.$transaction([
                prisma.payment.update({
                    where: { id: payment.id },
                    data: { status: 'completed' }
                }),
                prisma.user.update({
                    where: { id: payment.userId },
                    data: { balance: { increment: payment.amount } }
                })
            ]);
        }

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
