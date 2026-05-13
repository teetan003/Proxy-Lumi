import { useState } from 'react';
import api from '../api/axios';
import { X, CreditCard, Copy, CheckCircle } from 'lucide-react';

export default function DepositModal({ isOpen, onClose }) {
  const [amount, setAmount] = useState('100000');
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDeposit = async () => {
    setLoading(true);
    try {
      const res = await api.post('/payment/create', { 
        amount: parseFloat(amount), 
        provider: 'VietQR' 
      });
      setPaymentData(res.data);
    } catch (err) {
      alert('Failed to initiate deposit');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="glass w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-700/50">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CreditCard className="text-sky-500" />
            Deposit Funds
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-8">
          {!paymentData ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Deposit Amount (VND)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    className="w-full input-field pl-12 py-3 text-lg" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="100,000"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₫</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">Minimum deposit: 10,000 VND</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {['50000', '100000', '500000'].map((val) => (
                  <button 
                    key={val}
                    onClick={() => setAmount(val)}
                    className="py-2 px-3 rounded-lg border border-slate-700 hover:border-sky-500 hover:bg-sky-500/10 transition-all text-sm"
                  >
                    {parseInt(val).toLocaleString()} ₫
                  </button>
                ))}
              </div>

              <button 
                onClick={handleDeposit} 
                disabled={loading}
                className="w-full btn-primary py-4 text-lg"
              >
                {loading ? 'Processing...' : 'Generate VietQR'}
              </button>
            </div>
          ) : (
            <div className="text-center space-y-6 animate-in slide-in-from-bottom-4 duration-300">
              <div className="bg-white p-4 rounded-2xl inline-block shadow-lg">
                <img src={paymentData.qrUrl} alt="VietQR" className="w-64 h-64 mx-auto" />
              </div>
              
              <div className="space-y-2">
                <p className="text-slate-400 text-sm">Transfer exactly:</p>
                <p className="text-2xl font-bold text-sky-400">{paymentData.payment.amount.toLocaleString()} ₫</p>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex justify-between items-center group">
                <div className="text-left">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Transfer Content</p>
                  <p className="font-mono text-white">{paymentData.payment.transactionId}</p>
                </div>
                <button 
                  onClick={() => navigator.clipboard.writeText(paymentData.payment.transactionId)}
                  className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-sky-400 transition-colors"
                >
                  <Copy size={18} />
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-emerald-400 text-sm py-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Waiting for payment detection...
              </div>

              <button 
                onClick={() => setPaymentData(null)}
                className="text-slate-400 hover:text-white text-sm transition-colors"
              >
                Back to amount selection
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
