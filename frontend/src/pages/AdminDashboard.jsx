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
