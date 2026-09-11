import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  ArrowRight,
  ShieldCheck,
  Gift,
} from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('admin@luckydraw.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const success = await login(email, password);

    setLoading(false);

    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 flex items-center justify-center p-4">

      {/* Background Glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-fuchsia-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="relative w-full max-w-md">

        {/* Top Brand */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-xl text-white/80 text-xs font-medium shadow-lg">
            <Gift className="w-4 h-4 text-purple-300" />
            Lucky Draw Platform
          </div>
        </div>

        {/* Card */}
        <div className="relative bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.45)] border border-white/20 p-8 sm:p-9">

          {/* Card Top Glow */}
          <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

          {/* Logo */}
          <div className="text-center mb-8">

            <div className="relative inline-flex mb-5">
              <div className="absolute inset-0 bg-purple-500/30 blur-xl rounded-2xl" />

              <div className="relative w-16 h-16 bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/30">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Welcome Back
            </h1>

            <p className="text-gray-500 mt-2 text-sm">
              Sign in to participate & win exciting rewards
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>

              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-200 bg-gray-50/70 text-gray-900 text-sm outline-none transition-all duration-200 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>

              <div className="relative group">
                <LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full h-12 pl-10 pr-11 rounded-xl border border-gray-200 bg-gray-50/70 text-gray-900 text-sm outline-none transition-all duration-200 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Sign In */}
            <button
              type="submit"
              disabled={loading}
              className="group w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Register */}
          <p className="mt-7 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-purple-600 hover:text-purple-700 hover:underline transition-colors"
            >
              Create Account
            </Link>
          </p>

          {/* Demo Credentials */}
          <div className="mt-7 rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-indigo-50 p-4">

            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
              </div>

              <div>
                <p className="text-xs font-bold text-gray-800">
                  Demo Access
                </p>
                <p className="text-[11px] text-gray-500">
                  Use these credentials to test
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between gap-3 bg-white/70 rounded-lg px-3 py-2">
                <span className="font-semibold text-gray-600">
                  Admin
                </span>
                <span className="text-gray-500 text-right">
                  admin@luckydraw.com / admin123
                </span>
              </div>

              <div className="flex justify-between gap-3 bg-white/70 rounded-lg px-3 py-2">
                <span className="font-semibold text-gray-600">
                  User
                </span>
                <span className="text-gray-500 text-right">
                  ali@example.com / pass123
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            Secure & protected authentication
          </div>

        </div>

        {/* Bottom */}
        <p className="text-center text-xs text-white/40 mt-6">
          © {new Date().getFullYear()} Lucky Draw. All rights reserved.
        </p>

      </div>
    </div>
  );
};

export default Login;

