import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, UserPlus, Loader2, Sparkles, FlaskConical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="bg-slate-50 p-8 flex flex-col justify-center items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl opacity-50" />

        <div className="max-w-md w-full relative z-10">
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-200"
            >
              <Sparkles className="text-white" size={40} />
            </motion.div>
            <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight mb-2">
              {isLogin ? 'Welcome Back' : 'Join EduSync'}
            </h1>
            <p className="text-slate-500 italic">Access the future of academic management.</p>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200 border border-slate-100">
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm italic">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-bold text-slate-700 uppercase tracking-widest pl-1 mb-2 block">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="name@university.edu"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 uppercase tracking-widest pl-1 mb-2 block">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <p className="mt-8 text-center text-slate-500 text-sm">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button onClick={() => { setIsLogin(!isLogin); setError(null); }} className="text-indigo-600 font-bold hover:underline">
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex bg-slate-900 items-center justify-center p-20 relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 border border-white/20 rounded-full" />
          <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] border border-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="relative z-10 max-w-lg">
          <FlaskConical className="text-indigo-400 mb-8" size={60} />
          <h2 className="text-5xl font-display font-bold mb-6 tracking-tight">The Neural Edge</h2>
          <p className="text-slate-300 text-lg leading-relaxed mb-12 italic">
            "By optimizing model architecture through neuron pruning, EduSync delivers real-time smart campus insights with enterprise-level efficiency."
          </p>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="text-4xl font-bold text-white mb-2">94%</div>
              <p className="text-slate-400 text-sm uppercase tracking-widest">Validation Accuracy</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">12ms</div>
              <p className="text-slate-400 text-sm uppercase tracking-widest">Avg. Inference Time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
