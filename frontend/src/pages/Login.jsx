import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const res = await api.post(endpoint, { email, password });
      setAuth(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || (isLogin ? 'Login failed' : 'Registration failed'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4">
      <div className="glass p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text">Proxy Platform</h1>
          <p className="text-slate-400 mt-2">{isLogin ? 'Sign in to your account' : 'Create a new account'}</p>
        </div>
        
        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-4 text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            <input 
              type="email" 
              className="w-full input-field" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <input 
              type="password" 
              className="w-full input-field" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="w-full btn-primary py-3">
            {isLogin ? 'Sign In' : 'Register'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-slate-400 text-sm">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            onClick={() => { setIsLogin(!isLogin); setError(''); }} 
            className="text-sky-400 hover:underline"
          >
            {isLogin ? 'Register' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}
