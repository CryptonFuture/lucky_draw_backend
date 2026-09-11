import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Plus,
  Trophy,
  Users,
  Clock,
  Sparkles,
  ArrowUpRight,
  Gift,
  SlidersHorizontal,
  CalendarDays,
} from 'lucide-react';

const statusColors = {
  active: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  upcoming: 'bg-blue-50 text-blue-600 border-blue-100',
  completed: 'bg-gray-100 text-gray-600 border-gray-200',
  drawing: 'bg-amber-50 text-amber-600 border-amber-100',
  draft: 'bg-purple-50 text-purple-600 border-purple-100',
  cancelled: 'bg-red-50 text-red-600 border-red-100',
};

const Draws = () => {
  const { isAdmin } = useAuth();

  const [draws, setDraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const params = {};

    if (search) params.search = search;
    if (statusFilter) params.status = statusFilter;

    setLoading(true);

    api.get('/draws', { params })
      .then((res) => setDraws(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, statusFilter]);

  return (
    <div className="space-y-7">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 p-7 sm:p-8 shadow-xl">

        {/* Background glow */}
        <div className="absolute -right-20 -top-24 w-72 h-72 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute -left-20 -bottom-24 w-72 h-72 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

          <div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-white/70 text-xs font-medium mb-4">
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              Lucky Draws
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Explore Lucky Draws
            </h1>

            <p className="text-white/50 text-sm mt-2">
              Browse exciting draws and get your chance to win amazing prizes.
            </p>

          </div>

          {isAdmin && (
            <Link
              to="/draws/create"
              className="group inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-purple-700 font-semibold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              Create Draw
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          )}

        </div>
      </div>

      {/* =====================================================
          SEARCH / FILTER
      ====================================================== */}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">

        <div className="flex flex-col lg:flex-row gap-3">

          {/* Search */}

          <div className="relative flex-1">

            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

            <input
              placeholder="Search lucky draws..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-gray-50/70 text-sm text-gray-800 outline-none transition-all focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
            />

          </div>

          {/* Filter */}

          <div className="relative lg:w-52">

            <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none w-full h-12 pl-11 pr-10 rounded-xl border border-gray-200 bg-gray-50/70 text-sm text-gray-700 outline-none cursor-pointer transition-all focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              {isAdmin && <option value="draft">Draft</option>}
            </select>

            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

          </div>

        </div>

        {/* Filter summary */}

        <div className="flex items-center justify-between mt-4 px-1">

          <p className="text-xs text-gray-400">
            {loading
              ? 'Searching draws...'
              : `${draws.length} draw${draws.length !== 1 ? 's' : ''} found`}
          </p>

          {(search || statusFilter) && (
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('');
              }}
              className="text-xs font-semibold text-purple-600 hover:text-purple-700"
            >
              Clear filters
            </button>
          )}

        </div>

      </div>

      {/* =====================================================
          LOADING
      ====================================================== */}

      {loading ? (
        <div className="flex justify-center py-20">

          <div className="flex flex-col items-center gap-4">

            <div className="relative">

              <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl" />

              <div className="relative w-12 h-12 rounded-full border-4 border-purple-100 border-t-purple-600 animate-spin" />

            </div>

            <p className="text-sm text-gray-400 font-medium">
              Loading lucky draws...
            </p>

          </div>

        </div>
      ) : (

        /* =====================================================
           DRAW GRID
        ====================================================== */

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {draws.map((draw) => (

            <Link
              key={draw._id}
              to={`/draws/${draw._id}`}
              className="group relative overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >

              {/* Top gradient */}

              <div className="h-1.5 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500" />

              <div className="p-5">

                {/* Icon + status */}

                <div className="flex items-start justify-between gap-3 mb-4">

                  <div className="relative">

                    <div className="absolute inset-0 rounded-xl bg-purple-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>

                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full border text-[10px] font-semibold capitalize ${
                      statusColors[draw.status] ||
                      'bg-gray-50 text-gray-500 border-gray-100'
                    }`}
                  >
                    {draw.status}
                  </span>

                </div>

                {/* Title */}

                <h3 className="font-bold text-gray-900 text-base line-clamp-2 group-hover:text-purple-600 transition-colors">
                  {draw.title}
                </h3>

                {/* Description */}

                <p className="text-xs sm:text-sm text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                  {draw.description}
                </p>

                {/* Prize */}

                {draw.prizes?.length > 0 && (

                  <div className="relative mt-4 overflow-hidden rounded-xl border border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 p-3">

                    <div className="absolute -right-4 -top-5 w-16 h-16 rounded-full bg-amber-200/30 blur-xl" />

                    <div className="relative flex items-center gap-2">

                      <div className="w-8 h-8 shrink-0 rounded-lg bg-white flex items-center justify-center shadow-sm">
                        <Gift className="w-4 h-4 text-amber-500" />
                      </div>

                      <div className="min-w-0">

                        <p className="text-[10px] uppercase tracking-wide font-bold text-amber-600">
                          Top Prize
                        </p>

                        <p className="text-xs font-semibold text-amber-900 truncate">
                          {draw.prizes[0].title}
                          {draw.prizes.length > 1 &&
                            ` +${draw.prizes.length - 1} more`}
                        </p>

                      </div>

                    </div>

                  </div>

                )}

                {/* Bottom info */}

                <div className="mt-5 pt-4 border-t border-gray-100">

                  <div className="flex items-center justify-between gap-3">

                    <div className="flex items-center gap-1.5 text-xs text-gray-400 min-w-0">
                      <Users className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">
                        {draw.totalEntries} entries
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-gray-400 min-w-0">
                      {draw.status === 'completed' ? (
                        <>
                          <CalendarDays className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">
                            Drawn{' '}
                            {new Date(draw.drawDate).toLocaleDateString()}
                          </span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">
                            Ends{' '}
                            {new Date(draw.endDate).toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </div>

                  </div>

                  {/* View details */}

                  <div className="flex items-center justify-between mt-4">

                    <span className="text-xs font-semibold text-purple-600">
                      View details
                    </span>

                    <div className="w-7 h-7 rounded-lg bg-gray-50 group-hover:bg-purple-50 flex items-center justify-center transition-colors">

                      <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-purple-600 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />

                    </div>

                  </div>

                </div>

              </div>

            </Link>

          ))}

          {/* =================================================
              EMPTY STATE
          ================================================== */}

          {draws.length === 0 && (

            <div className="col-span-full">

              <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-16 px-6 text-center">

                <div className="relative inline-flex">

                  <div className="absolute inset-0 rounded-2xl bg-purple-500/10 blur-xl" />

                  <div className="relative w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center">
                    <Trophy className="w-7 h-7 text-purple-300" />
                  </div>

                </div>

                <h3 className="font-bold text-gray-700 mt-4">
                  No draws found
                </h3>

                <p className="text-sm text-gray-400 mt-1 max-w-sm mx-auto">
                  We couldn't find any lucky draws matching your current
                  search or filter.
                </p>

                {(search || statusFilter) && (
                  <button
                    onClick={() => {
                      setSearch('');
                      setStatusFilter('');
                    }}
                    className="mt-4 px-4 py-2 rounded-lg bg-purple-50 text-purple-600 text-xs font-semibold hover:bg-purple-100 transition-colors"
                  >
                    Clear filters
                  </button>
                )}

              </div>

            </div>

          )}

        </div>
      )}

    </div>
  );
};

export default Draws;

