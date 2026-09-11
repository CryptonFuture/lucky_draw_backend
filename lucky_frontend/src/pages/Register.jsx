import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  UserRound,
  Phone,
  ArrowRight,
  ShieldCheck,
  Gift,
} from 'lucide-react';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const success = await register(
      form.name,
      form.email,
      form.password,
      form.phone
    );

    setLoading(false);

    if (success) {
      navigate('/');
    }
  };

  const updateField = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 flex items-center justify-center p-4">

      {/* Background Glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="relative w-full max-w-md">

        {/* Top Brand */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-xl text-white/80 text-xs font-medium shadow-lg">
            <Gift className="w-4 h-4 text-purple-300" />
            Lucky Draw Platform
          </div>
        </div>

        {/* Register Card */}
        <div className="relative bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.45)] border border-white/20 p-8 sm:p-9">

          {/* Top Accent */}
          <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

          {/* Header */}
          <div className="text-center mb-7">

            <div className="relative inline-flex mb-4">
              <div className="absolute inset-0 bg-purple-500/30 blur-xl rounded-2xl" />

              <div className="relative w-16 h-16 bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/30">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Create Account
            </h1>

            <p className="text-gray-500 mt-2 text-sm">
              Join the community and start winning exciting rewards
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>

              <div className="relative group">
                <UserRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />

                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-200 bg-gray-50/70 text-gray-900 text-sm outline-none transition-all duration-200 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>

              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />

                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="Enter your email"
                  className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-200 bg-gray-50/70 text-gray-900 text-sm outline-none transition-all duration-200 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone
                <span className="ml-1 text-xs font-normal text-gray-400">
                  (Optional)
                </span>
              </label>

              <div className="relative group">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />

                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-200 bg-gray-50/70 text-gray-900 text-sm outline-none transition-all duration-200 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
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
                  value={form.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  placeholder="Create a secure password"
                  minLength={6}
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

              <p className="text-[11px] text-gray-400 mt-1.5 ml-1">
                Password must be at least 6 characters
              </p>
            </div>

            {/* Create Account */}
            <button
              type="submit"
              disabled={loading}
              className="group w-full h-12 mt-2 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-7 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-purple-600 hover:text-purple-700 hover:underline transition-colors"
            >
              Sign In
            </Link>
          </p>

          {/* Security Info */}
          <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-gray-400">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
            Your information is securely protected
          </div>

        </div>

        {/* Footer */}
        <p className="text-center text-xs text-white/40 mt-6">
          © {new Date().getFullYear()} Lucky Draw. All rights reserved.
        </p>

      </div>
    </div>
  );
};

export default Register;

