import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';
import { LogOut, Plus, RefreshCw, Trash2, Shield, Globe, Clock, Wallet } from 'lucide-react';
import DepositModal from '../components/DepositModal';

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  
  const { data: proxies, isLoading, refetch } = useQuery({
    queryKey: ['proxies'],
    queryFn: async () => {
      const res = await api.get('/proxies');
      return res.data;
    }
  });

  const handleCreate = async () => {
    try {
      await api.post('/proxies/create', { count: 1, days: 30 });
      refetch();
    } catch (err) {
      alert('Failed to create proxy');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      {/* Header */}
      <nav className="glass border-b border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Shield className="text-sky-500 w-8 h-8" />
          <span className="text-xl font-bold gradient-text">ProxyPlatform</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:block">
            <p className="text-sm text-slate-400">Welcome,</p>
            <p className="text-sm font-semibold text-white">{user?.email}</p>
          </div>
          <button onClick={logout} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">My Proxies</h1>
            <p className="text-slate-400 mt-1">Manage your active proxy servers and monitor their status.</p>
          </div>
          <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            Buy New Proxy
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="glass p-6 rounded-2xl">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 text-sm">Total Active</p>
                <h3 className="text-2xl font-bold mt-1">{proxies?.length || 0}</h3>
              </div>
              <div className="p-3 bg-sky-500/10 rounded-xl text-sky-500">
                <Globe size={24} />
              </div>
            </div>
          </div>
          <div className="glass p-6 rounded-2xl relative overflow-hidden group">
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-slate-400 text-sm">Credits Balance</p>
                <h3 className="text-2xl font-bold mt-1">{user?.balance?.toLocaleString() || '0'} ₫</h3>
              </div>
              <button 
                onClick={() => setIsDepositOpen(true)}
                className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500 hover:bg-emerald-500/20 transition-all"
              >
                <Wallet size={24} />
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 text-emerald-500/5 rotate-12 group-hover:scale-110 transition-transform">
                <Wallet size={100} />
            </div>
          </div>
          <div className="glass p-6 rounded-2xl">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 text-sm">Expiring Soon</p>
                <h3 className="text-2xl font-bold mt-1">0</h3>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
                <Clock size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Proxy Table */}
        <div className="glass rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-800/50 text-slate-400 text-sm uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">IP Address</th>
                  <th className="px-6 py-4 font-medium">Port</th>
                  <th className="px-6 py-4 font-medium">Credentials</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Expires At</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {isLoading ? (
                  <tr><td colSpan="6" className="px-6 py-10 text-center text-slate-500">Loading your proxies...</td></tr>
                ) : proxies?.length === 0 ? (
                  <tr><td colSpan="6" className="px-6 py-10 text-center text-slate-500">No proxies found. Start by buying one!</td></tr>
                ) : proxies?.map((proxy) => (
                  <tr key={proxy.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-sky-400">{proxy.proxyIp}</td>
                    <td className="px-6 py-4 font-mono">{proxy.port}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="text-slate-500">{proxy.username}</span>
                      <span className="text-slate-600 mx-1">:</span>
                      <span className="text-slate-500">{proxy.password}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        proxy.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                      }`}>
                        {proxy.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {new Date(proxy.expiresAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button title="Renew" className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-sky-400 transition-colors">
                        <RefreshCw size={18} />
                      </button>
                      <button title="Delete" className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-red-400 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <DepositModal isOpen={isDepositOpen} onClose={() => setIsDepositOpen(false)} />
    </div>
  );
}
