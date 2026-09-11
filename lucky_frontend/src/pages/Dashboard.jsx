import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Trophy,
  Users,
  Ticket,
  Award,
  Clock,
  Sparkles,
  ArrowUpRight,
  CalendarDays,
  Gift,
  Crown,
  TrendingUp,
} from 'lucide-react';

const statusColors = {
  active: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  upcoming: 'bg-blue-50 text-blue-600 border-blue-100',
  completed: 'bg-gray-100 text-gray-600 border-gray-200',
  drawing: 'bg-amber-50 text-amber-600 border-amber-100',
  draft: 'bg-purple-50 text-purple-600 border-purple-100',
  cancelled: 'bg-red-50 text-red-600 border-red-100',
};

const Dashboard = () => {
  const { isAdmin } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard')
      .then((res) => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl" />
            <div className="relative w-12 h-12 rounded-full border-4 border-purple-100 border-t-purple-600 animate-spin" />
          </div>

          <p className="text-sm text-gray-400 font-medium">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-red-50 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-red-400" />
          </div>
          <p className="font-semibold text-gray-700">
            Failed to load dashboard
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Please try again later.
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // ADMIN DASHBOARD
  // ============================================================

  if (isAdmin) {
    const { overview, recentDraws, recentWinners } = data;

    const stats = [
      {
        label: 'Total Draws',
        value: overview.totalDraws,
        icon: Trophy,
        gradient: 'from-violet-500 to-purple-600',
        shadow: 'shadow-purple-500/20',
      },
      {
        label: 'Active Draws',
        value: overview.activeDraws,
        icon: Sparkles,
        gradient: 'from-emerald-400 to-green-600',
        shadow: 'shadow-green-500/20',
      },
      {
        label: 'Completed',
        value: overview.completedDraws,
        icon: Award,
        gradient: 'from-blue-500 to-indigo-600',
        shadow: 'shadow-blue-500/20',
      },
      {
        label: 'Participants',
        value: overview.totalUsers,
        icon: Users,
        gradient: 'from-orange-400 to-orange-600',
        shadow: 'shadow-orange-500/20',
      },
      {
        label: 'Total Entries',
        value: overview.totalEntries,
        icon: Ticket,
        gradient: 'from-pink-500 to-rose-600',
        shadow: 'shadow-pink-500/20',
      },
    ];

    return (
      <div className="space-y-7">

        {/* ================= HEADER ================= */}

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 p-7 sm:p-8 shadow-xl">

          <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-purple-500/20 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl" />

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-white/70 text-xs font-medium mb-4">
                <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                Admin Control Center
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Admin Dashboard
              </h1>

              <p className="text-white/50 text-sm mt-2">
                Manage your lucky draws, participants and winners.
              </p>
            </div>

            <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-white/10 border border-white/10 items-center justify-center">
              <Crown className="w-7 h-7 text-amber-300" />
            </div>

          </div>
        </div>

        {/* ================= STATS ================= */}

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">

          {stats.map((s) => {
            const Icon = s.icon;

            return (
              <div
                key={s.label}
                className="group relative overflow-hidden bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >

                <div className="flex items-start justify-between">

                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.gradient} ${s.shadow} shadow-lg flex items-center justify-center`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-purple-500 transition-colors" />

                </div>

                <div className="mt-5">
                  <p className="text-2xl font-bold text-gray-900">
                    {s.value}
                  </p>

                  <p className="text-xs text-gray-400 mt-1 font-medium">
                    {s.label}
                  </p>
                </div>

                <div className="absolute -right-6 -bottom-6 w-20 h-20 rounded-full bg-gray-50 group-hover:bg-purple-50 transition-colors" />
              </div>
            );
          })}

        </div>

        {/* ================= CONTENT ================= */}

        <div className="grid lg:grid-cols-2 gap-6">

          {/* Recent Draws */}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">

              <div>
                <h3 className="font-bold text-gray-900">
                  Recent Draws
                </h3>

                <p className="text-xs text-gray-400 mt-1">
                  Latest lucky draw activity
                </p>
              </div>

              <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
                <Gift className="w-4 h-4 text-purple-600" />
              </div>

            </div>

            <div className="p-4 space-y-2">

              {recentDraws?.length > 0 ? (
                recentDraws.map((d) => (
                  <Link
                    key={d._id}
                    to={`/draws/${d._id}`}
                    className="group flex items-center justify-between gap-4 p-4 rounded-xl hover:bg-purple-50/60 transition-all duration-200"
                  >

                    <div className="min-w-0">

                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 shrink-0 rounded-lg bg-gray-50 group-hover:bg-white flex items-center justify-center">
                          <Trophy className="w-4 h-4 text-purple-500" />
                        </div>

                        <p className="font-semibold text-sm text-gray-800 truncate">
                          {d.title}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 ml-10 mt-1">
                        <Ticket className="w-3 h-3 text-gray-400" />
                        <p className="text-xs text-gray-400">
                          {d.totalEntries} entries
                        </p>
                      </div>

                    </div>

                    <span
                      className={`shrink-0 px-2.5 py-1 rounded-full border text-[10px] font-semibold capitalize ${
                        statusColors[d.status] ||
                        'bg-gray-50 text-gray-500 border-gray-100'
                      }`}
                    >
                      {d.status}
                    </span>

                  </Link>
                ))
              ) : (
                <div className="text-center py-10">
                  <Trophy className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">
                    No recent draws
                  </p>
                </div>
              )}

            </div>
          </div>

          {/* Recent Winners */}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">

              <div>
                <h3 className="font-bold text-gray-900">
                  Recent Winners
                </h3>

                <p className="text-xs text-gray-400 mt-1">
                  Latest lucky draw winners
                </p>
              </div>

              <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                <Crown className="w-4 h-4 text-amber-500" />
              </div>

            </div>

            <div className="p-4 space-y-2">

              {recentWinners?.length > 0 ? (
                recentWinners.map((w) => (
                  <div
                    key={w._id}
                    className="group flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-amber-50/70 to-orange-50/40 hover:from-amber-100/70 transition-all duration-200"
                  >

                    <div className="relative w-10 h-10 shrink-0 rounded-xl bg-white shadow-sm flex items-center justify-center">
                      <Award className="w-5 h-5 text-amber-500" />

                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[8px] flex items-center justify-center font-bold">
                        {w.prizeRank}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-gray-800 truncate">
                        {w.user?.name}
                      </p>

                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {w.draw?.title}
                      </p>

                      <p className="text-[10px] text-amber-600 font-medium mt-1">
                        Rank #{w.prizeRank}
                      </p>
                    </div>

                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <Award className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">
                    No winners yet
                  </p>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    );
  }

  // ============================================================
  // PARTICIPANT DASHBOARD
  // ============================================================

  const {
    overview,
    activeDraws,
    upcomingDraws,
    recentEntries,
  } = data;

  return (
    <div className="space-y-7">

      {/* ================= HEADER ================= */}

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 p-7 sm:p-8 shadow-xl">

        <div className="absolute -right-20 -top-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />

        <div className="relative">

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-white/70 text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            Lucky Draw Member
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            My Dashboard
          </h1>

          <p className="text-white/50 text-sm mt-2">
            Track your entries, wins and discover new opportunities.
          </p>

        </div>
      </div>

      {/* ================= PERSONAL STATS ================= */}

      <div className="grid grid-cols-3 gap-3 sm:gap-5">

        {/* Entries */}

        <div className="group bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

          <div className="w-11 h-11 sm:w-12 sm:h-12 mx-auto rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Ticket className="w-5 h-5 text-white" />
          </div>

          <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-4">
            {overview.myEntries}
          </p>

          <p className="text-[10px] sm:text-xs text-gray-400 mt-1 font-medium">
            My Entries
          </p>

        </div>

        {/* Wins */}

        <div className="group bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

          <div className="w-11 h-11 sm:w-12 sm:h-12 mx-auto rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Trophy className="w-5 h-5 text-white" />
          </div>

          <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-4">
            {overview.myWins}
          </p>

          <p className="text-[10px] sm:text-xs text-gray-400 mt-1 font-medium">
            Wins
          </p>

        </div>

        {/* Win Rate */}

        <div className="group bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

          <div className="w-11 h-11 sm:w-12 sm:h-12 mx-auto rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/20">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>

          <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-4">
            {overview.winRate}%
          </p>

          <p className="text-[10px] sm:text-xs text-gray-400 mt-1 font-medium">
            Win Rate
          </p>

        </div>

      </div>

      {/* ================= ACTIVE DRAWS ================= */}

      <div>

        <div className="flex items-center justify-between mb-4">

          <div>
            <h3 className="font-bold text-lg text-gray-900">
              Active Draws
            </h3>

            <p className="text-xs text-gray-400 mt-1">
              Enter now for a chance to win
            </p>
          </div>

          <Link
            to="/draws"
            className="group flex items-center gap-1 text-sm font-semibold text-purple-600 hover:text-purple-700"
          >
            View all
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>

        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {activeDraws?.map((d) => (
            <Link
              key={d._id}
              to={`/draws/${d._id}`}
              className="group relative overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >

              {/* Card Gradient */}

              <div className="h-1.5 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500" />

              <div className="p-5">

                <div className="flex items-start justify-between gap-3 mb-3">

                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                    <Gift className="w-5 h-5 text-purple-600" />
                  </div>

                  <span
                    className={`badge ${
                      statusColors[d.status] ||
                      'bg-gray-50 text-gray-500'
                    }`}
                  >
                    {d.status}
                  </span>

                </div>

                <h4 className="font-bold text-gray-900 text-sm line-clamp-2 group-hover:text-purple-600 transition-colors">
                  {d.title}
                </h4>

                <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                  {d.description}
                </p>

                <div className="mt-5 pt-4 border-t border-gray-100">

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>
                        Ends {new Date(d.endDate).toLocaleDateString()}
                      </span>
                    </div>

                    <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-purple-500 transition-colors" />

                  </div>

                  <div className="flex items-center gap-1.5 mt-3 text-xs text-purple-600 font-semibold">
                    <Users className="w-3.5 h-3.5" />
                    {d.totalEntries} participants
                  </div>

                </div>

              </div>
            </Link>
          ))}

          {(!activeDraws || activeDraws.length === 0) && (
            <div className="sm:col-span-2 lg:col-span-3 bg-white rounded-2xl border border-dashed border-gray-200 py-12 text-center">

              <div className="w-12 h-12 mx-auto rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
                <Gift className="w-6 h-6 text-gray-300" />
              </div>

              <p className="text-sm font-medium text-gray-500">
                No active draws right now
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Check back soon for new opportunities.
              </p>

            </div>
          )}

        </div>
      </div>

      {/* ================= UPCOMING ================= */}

      {upcomingDraws?.length > 0 && (
        <div>

          <div className="mb-4">
            <h3 className="font-bold text-lg text-gray-900">
              Upcoming Draws
            </h3>

            <p className="text-xs text-gray-400 mt-1">
              Get ready for what's coming next
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">

            {upcomingDraws.map((d) => (
              <Link
                key={d._id}
                to={`/draws/${d._id}`}
                className="group flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >

                <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <CalendarDays className="w-5 h-5 text-white" />
                </div>

                <div className="min-w-0 flex-1">

                  <h4 className="font-bold text-sm text-gray-800 truncate group-hover:text-purple-600 transition-colors">
                    {d.title}
                  </h4>

                  <p className="text-xs text-gray-400 mt-1">
                    Starts {new Date(d.startDate).toLocaleDateString()}
                  </p>

                </div>

                <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-purple-500 transition-colors" />

              </Link>
            ))}

          </div>
        </div>
      )}

      {/* ================= RECENT ENTRIES ================= */}

      {recentEntries?.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

          <div className="flex items-center gap-3 mb-5">

            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <Ticket className="w-5 h-5 text-purple-600" />
            </div>

            <div>
              <h3 className="font-bold text-gray-900">
                Recent Entries
              </h3>

              <p className="text-xs text-gray-400 mt-1">
                Your latest lucky draw activity
              </p>
            </div>

          </div>

          <div className="space-y-2">

            {recentEntries.map((entry, index) => (
              <div
                key={entry._id || index}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">

                  <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center">
                    <Ticket className="w-4 h-4 text-purple-500" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      {entry.draw?.title || 'Lucky Draw'}
                    </p>

                    <p className="text-xs text-gray-400">
                      Entry #{entry.ticketNumber || entry._id}
                    </p>
                  </div>

                </div>

                <span className="text-xs text-gray-400">
                  {entry.createdAt
                    ? new Date(entry.createdAt).toLocaleDateString()
                    : ''}
                </span>

              </div>
            ))}

          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;

