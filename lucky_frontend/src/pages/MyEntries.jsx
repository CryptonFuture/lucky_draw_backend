import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  Ticket,
  Trophy,
  ExternalLink,
  Sparkles,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Gift,
} from 'lucide-react';

const MyEntries = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/draws/my-entries')
      .then((res) => setEntries(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Loader2 className="w-7 h-7 text-white animate-spin" />
            </div>

            <div className="absolute inset-0 rounded-2xl bg-violet-500 blur-xl opacity-20" />
          </div>

          <p className="text-sm font-medium text-slate-500">
            Loading your entries...
          </p>
        </div>
      </div>
    );
  }

  const winnerCount = entries.filter((entry) => entry.isWinner).length;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">

      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-violet-950 to-indigo-950 shadow-2xl">

        <div className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative p-6 sm:p-8">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">

            <div className="flex items-start gap-4">

              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                <Ticket className="w-7 h-7 text-violet-300" />
              </div>

              <div>

                <p className="text-violet-300 text-xs font-bold uppercase tracking-[0.2em] mb-2">
                  Participation Center
                </p>

                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  My Entries
                </h1>

                <p className="text-slate-300 mt-2 text-sm sm:text-base">
                  Track all your lucky draw participations and winning tickets.
                </p>

              </div>

            </div>

            {entries.length > 0 && (
              <Link
                to="/draws"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-900 text-sm font-bold shadow-lg hover:bg-violet-50 transition-all"
              >
                <Sparkles className="w-4 h-4 text-violet-600" />
                Browse Draws
              </Link>
            )}

          </div>

          {/* Stats */}
          {entries.length > 0 && (
            <div className="grid grid-cols-2 gap-3 mt-7 pt-6 border-t border-white/10">

              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                  <Ticket className="w-4 h-4 text-violet-200" />
                </div>

                <div>
                  <p className="text-white font-bold">
                    {entries.length}
                  </p>

                  <p className="text-slate-400 text-[11px]">
                    Total Entries
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="w-9 h-9 rounded-lg bg-amber-400/10 flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-amber-300" />
                </div>

                <div>
                  <p className="text-white font-bold">
                    {winnerCount}
                  </p>

                  <p className="text-slate-400 text-[11px]">
                    Wins
                  </p>
                </div>
              </div>

            </div>
          )}

        </div>
      </section>

      {/* =========================================================
          EMPTY STATE
      ========================================================= */}

      {entries.length === 0 ? (
        <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-sm">

          <div className="absolute top-0 right-0 w-52 h-52 bg-violet-100/50 rounded-full blur-3xl" />

          <div className="relative text-center py-16 px-6">

            <div className="relative inline-flex mb-5">

              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center">
                <Ticket className="w-8 h-8 text-violet-500" />
              </div>

              <div className="absolute -right-2 -top-2 w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>

            </div>

            <h3 className="text-lg font-bold text-slate-800">
              No entries yet
            </h3>

            <p className="text-sm text-slate-400 mt-1 mb-6 max-w-sm mx-auto">
              You haven't joined any lucky draws yet. Explore the available draws and grab your first ticket.
            </p>

            <Link
              to="/draws"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-violet-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              <Gift className="w-4 h-4" />
              Browse Lucky Draws
              <ChevronRight className="w-4 h-4" />
            </Link>

          </div>
        </div>
      ) : (

        /* =======================================================
           ENTRY LIST
        ======================================================= */

        <div className="space-y-4">

          {entries.map((entry) => {

            const isWinner = entry.isWinner;

            return (
              <div
                key={entry._id}
                className={`group relative overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
                  isWinner
                    ? 'bg-gradient-to-r from-amber-50 via-white to-orange-50 border-amber-200'
                    : 'bg-white border-slate-200 hover:border-violet-200'
                }`}
              >

                {/* Winner accent */}
                {isWinner && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-orange-500" />
                )}

                <div className="p-4 sm:p-5">

                  <div className="flex items-center gap-4">

                    {/* Icon */}
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                        isWinner
                          ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-200/40'
                          : 'bg-gradient-to-br from-violet-100 to-indigo-100'
                      }`}
                    >
                      {isWinner ? (
                        <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                      ) : (
                        <Ticket className="w-6 h-6 sm:w-7 sm:h-7 text-violet-600" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">

                      <div className="flex flex-wrap items-center gap-2">

                        <Link
                          to={`/draws/${entry.draw?._id}`}
                          className="font-bold text-slate-800 hover:text-violet-600 truncate transition-colors"
                        >
                          {entry.draw?.title || 'Unknown Draw'}
                        </Link>

                        {isWinner && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-800 text-[11px] font-bold">
                            <Trophy className="w-3 h-3" />
                            Rank #{entry.prizeRank}
                          </span>
                        )}

                      </div>

                      {/* Metadata */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">

                        <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                          <Ticket className="w-3 h-3 text-violet-500" />
                          {entry.ticketNumber}
                        </span>

                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 capitalize">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          {entry.status}
                        </span>

                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                          <CalendarDays className="w-3.5 h-3.5" />
                          {new Date(entry.createdAt).toLocaleDateString()}
                        </span>

                      </div>

                    </div>

                    {/* Action */}
                    <Link
                      to={`/draws/${entry.draw?._id}`}
                      className={`hidden sm:flex w-10 h-10 rounded-xl items-center justify-center transition-all ${
                        isWinner
                          ? 'bg-white border border-amber-200 hover:bg-amber-50'
                          : 'bg-slate-50 border border-slate-200 hover:bg-violet-50 hover:border-violet-200'
                      }`}
                      title="View draw"
                    >
                      <ExternalLink
                        className={`w-4 h-4 ${
                          isWinner
                            ? 'text-amber-600'
                            : 'text-slate-400 group-hover:text-violet-600'
                        }`}
                      />
                    </Link>

                  </div>

                  {/* Winner Message */}
                  {isWinner && (
                    <div className="mt-4 pt-4 border-t border-amber-100">

                      <div className="flex items-center gap-2 text-xs font-semibold text-amber-700">

                        <Sparkles className="w-4 h-4" />

                        <span>
                          Congratulations! You won a prize in this draw.
                        </span>

                      </div>

                    </div>
                  )}

                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
};

export default MyEntries;
