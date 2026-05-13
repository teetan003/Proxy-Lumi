import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';
import { Users, Server, DollarSign, Activity, Settings, LogOut } from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout } = useAuthStore();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await api.get('/admin/stats');
      return res.data;
    }
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await api.get('/admin/users');
      return res.data;
    }
  });

  const { data: proxies, isLoading: proxiesLoading, refetch: refetchProxies } = useQuery({
    queryKey: ['admin-proxies'],
    queryFn: async () => {
      const res = await api.get('/admin/proxies');
      return res.data;
    }
  });

  const [bulkProxies, setBulkProxies] = useState('');
  const [checkingId, setCheckingId] = useState(null);

  const handleAddProxies = async () => {
    try {
      const proxyList = bulkProxies.split('\n').filter(p => p.trim()).map(line => {
        // Expected format: ip:port:user:pass:country
        const [proxyIp, port, username, password, country] = line.split(':');
        return { proxyIp, port, username, password, country: country || 'Unknown', type: 'http' };
      });
      
      if (proxyList.length === 0) return;
      
      await api.post('/admin/proxies/bulk', { proxies: proxyList });
      setBulkProxies('');
      refetchProxies();
      alert('Proxies added successfully');
    } catch (err) {
      alert('Error adding proxies: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleCheckHealth = async (id) => {
    setCheckingId(id);
    try {
      await api.post(`/admin/proxies/${id}/check`);
      refetchProxies();
    } catch (err) {
      alert('Error checking proxy: ' + (err.response?.data?.message || err.message));
    } finally {
      setCheckingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      {/* Sidebar & Top Navigation */}
      <nav className="glass border-b border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Settings className="text-purple-500 w-8 h-8" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Admin Panel
          </span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={logout} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-white mb-8">System Overview</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="glass p-6 rounded-2xl relative overflow-hidden group">
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-slate-400 text-sm">Total Revenue</p>
                <h3 className="text-2xl font-bold mt-1 text-white">{stats?.revenue?.toLocaleString() || '0'} ₫</h3>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                <DollarSign size={24} />
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 text-emerald-500/5 rotate-12 group-hover:scale-110 transition-transform">
              <DollarSign size={100} />
            </div>
          </div>

          <div className="glass p-6 rounded-2xl relative overflow-hidden group">
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-slate-400 text-sm">Total Users</p>
                <h3 className="text-2xl font-bold mt-1 text-white">{stats?.users || '0'}</h3>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                <Users size={24} />
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-2xl relative overflow-hidden group">
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-slate-400 text-sm">Active Proxies</p>
                <h3 className="text-2xl font-bold mt-1 text-white">{stats?.activeProxies || '0'}</h3>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500">
                <Server size={24} />
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-2xl relative overflow-hidden group">
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-slate-400 text-sm">System Status</p>
                <h3 className="text-2xl font-bold mt-1 text-emerald-400">Online</h3>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                <Activity size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Proxy Management Section */}
        <div className="glass rounded-2xl overflow-hidden shadow-xl mb-10">
          <div className="p-6 border-b border-slate-700/50 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Server className="text-purple-500" />
              Proxy Inventory
            </h2>
          </div>
          
          <div className="p-6 border-b border-slate-700/50 bg-slate-800/30">
            <h3 className="text-sm font-semibold text-slate-300 mb-2">Bulk Add HTTP Proxies</h3>
            <p className="text-xs text-slate-500 mb-3">Format: IP:Port:Username:Password:Country (one per line)</p>
            <textarea 
              className="w-full input-field h-32 mb-3 font-mono text-sm"
              value={bulkProxies}
              onChange={(e) => setBulkProxies(e.target.value)}
              placeholder="192.168.1.1:3128:user:pass:VN&#10;10.0.0.1:8080:admin:1234:US"
            />
            <button onClick={handleAddProxies} className="btn-primary">Add Proxies to Inventory</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-800/50 text-slate-400 text-sm uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">IP:Port</th>
                  <th className="px-6 py-4 font-medium">Country</th>
                  <th className="px-6 py-4 font-medium">Latency</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Owner</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {proxiesLoading ? (
                  <tr><td colSpan="6" className="px-6 py-10 text-center text-slate-500">Loading proxies...</td></tr>
                ) : proxies?.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm text-slate-300">{p.proxyIp}:{p.port}</td>
                    <td className="px-6 py-4">{p.country || 'Unknown'}</td>
                    <td className="px-6 py-4">
                      {p.latency ? (
                        <span className={p.latency < 500 ? 'text-emerald-400' : 'text-yellow-400'}>{p.latency}ms</span>
                      ) : <span className="text-slate-500">-</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        p.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 
                        p.status === 'disabled' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'
                      }`}>
                        {p.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">{p.user?.email || 'Unassigned (Inventory)'}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleCheckHealth(p.id)}
                        disabled={checkingId === p.id}
                        className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded transition-colors disabled:opacity-50"
                      >
                        {checkingId === p.id ? 'Checking...' : 'Check'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Management Table */}
        <div className="glass rounded-2xl overflow-hidden shadow-xl mb-10">
          <div className="p-6 border-b border-slate-700/50">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="text-sky-500" />
              User Management
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-800/50 text-slate-400 text-sm uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Balance</th>
                  <th className="px-6 py-4 font-medium">Proxies</th>
                  <th className="px-6 py-4 font-medium text-right">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {usersLoading ? (
                  <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-500">Loading users...</td></tr>
                ) : users?.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        u.role === 'admin' ? 'bg-purple-500/10 text-purple-400' : 'bg-slate-700 text-slate-300'
                      }`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-emerald-400 font-bold">{u.balance.toLocaleString()} ₫</td>
                    <td className="px-6 py-4">{u._count.proxies}</td>
                    <td className="px-6 py-4 text-sm text-slate-400 text-right">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
