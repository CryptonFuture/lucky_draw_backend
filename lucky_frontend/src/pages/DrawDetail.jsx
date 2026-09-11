
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import {
  Trophy,
  Users,
  Clock,
  Ticket,
  Award,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  Loader2,
  CalendarDays,
  ShieldCheck,
  Gift,
  Crown,
  Hash,
  ChevronRight,
} from 'lucide-react';

const statusColors = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  upcoming: 'bg-blue-50 text-blue-700 border-blue-200',
  completed: 'bg-slate-100 text-slate-600 border-slate-200',
  drawing: 'bg-amber-50 text-amber-700 border-amber-200',
  draft: 'bg-violet-50 text-violet-700 border-violet-200',
};

const DrawDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const [draw, setDraw] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [conducting, setConducting] = useState(false);
  const [winners, setWinners] = useState(null);

  const fetchDraw = async () => {
    try {
      const [drawRes, entriesRes] = await Promise.all([
        api.get(`/draws/${id}`),
        api.get(`/draws/${id}/entries`, {
          params: { limit: 100 },
        }),
      ]);

      setDraw(drawRes.data.data);
      setEntries(entriesRes.data.data);
    } catch (error) {
      toast.error('Failed to load draw');
      navigate('/draws');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDraw();
  }, [id]);

  const handleJoin = async () => {
    setJoining(true);

    try {
      const res = await api.post(`/draws/${id}/join`);

      toast.success(`Joined! Ticket: ${res.data.data.ticketNumber}`);

      fetchDraw();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to join'
      );
    } finally {
      setJoining(false);
    }
  };

  const handleConduct = async () => {
    if (
      !confirm(
        'Are you sure you want to conduct this lucky draw? This cannot be undone!'
      )
    ) {
      return;
    }

    setConducting(true);

    try {
      const res = await api.post(`/draws/${id}/conduct`);

      setWinners(res.data.data.winners);

      toast.success('Lucky draw completed!');

      fetchDraw();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to conduct draw'
      );
    } finally {
      setConducting(false);
    }
  };

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
            Loading draw details...
          </p>
        </div>
      </div>
    );
  }

  if (!draw) return null;

  const hasJoined = draw.userEntries?.length > 0;

  const canJoin =
    (draw.status === 'active' || draw.status === 'upcoming') &&
    !hasJoined;

  const canConduct =
    isAdmin &&
    (draw.status === 'active' || draw.status === 'upcoming') &&
    draw.totalEntries > 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">

      {/* Back Navigation */}
      <button
        onClick={() => navigate('/draws')}
        className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-violet-600 transition-colors"
      >
        <span className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center group-hover:border-violet-200 group-hover:bg-violet-50 transition-all">
          <ArrowLeft className="w-4 h-4" />
        </span>

        Back to Draws
      </button>

      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-violet-950 to-indigo-950 shadow-2xl">

        {/* Background Glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />

        <div className="relative p-6 sm:p-8 lg:p-10">

          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">

            {/* Hero Content */}
            <div className="flex-1">

              <div className="flex flex-wrap items-center gap-2 mb-5">

                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${
                    statusColors[draw.status]
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current mr-2" />
                  {draw.status}
                </span>

                {draw.entryFee === 0 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 text-xs font-semibold">
                    <Gift className="w-3.5 h-3.5" />
                    Free Entry
                  </span>
                )}
              </div>

              <div className="flex items-start gap-4">

                <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-white/10 border border-white/10 items-center justify-center shrink-0">
                  <Trophy className="w-7 h-7 text-amber-300" />
                </div>

                <div>
                  <p className="text-violet-300 text-xs font-bold uppercase tracking-[0.2em] mb-2">
                    Lucky Draw
                  </p>

                  <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                    {draw.title}
                  </h1>

                  <p className="text-slate-300 mt-3 max-w-2xl leading-relaxed">
                    {draw.description}
                  </p>
                </div>

              </div>

              {/* Date Information */}
              <div className="flex flex-wrap gap-3 mt-7">

                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm">
                  <CalendarDays className="w-4 h-4 text-violet-300" />
                  <span>
                    {new Date(draw.startDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm">
                  <Clock className="w-4 h-4 text-indigo-300" />
                  <span>
                    Ends {new Date(draw.endDate).toLocaleDateString()}
                  </span>
                </div>

              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 lg:min-w-[190px]">

              {canJoin && (
                <button
                  onClick={handleJoin}
                  disabled={joining}
                  className="group w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-slate-900 font-bold shadow-xl shadow-black/20 hover:bg-violet-50 hover:-translate-y-0.5 transition-all disabled:opacity-60"
                >
                  {joining ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Ticket className="w-5 h-5 text-violet-600" />
                  )}

                  {joining ? 'Joining...' : 'Join Draw'}

                  {!joining && (
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  )}
                </button>
              )}

              {hasJoined && (
                <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 text-sm font-semibold">
                  <CheckCircle className="w-4 h-4" />
                  You have joined!
                </div>
              )}

              {canConduct && (
                <button
                  onClick={handleConduct}
                  disabled={conducting}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold shadow-lg shadow-orange-500/20 hover:from-amber-500 hover:to-orange-600 transition-all disabled:opacity-60"
                >
                  {conducting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Sparkles className="w-5 h-5" />
                  )}

                  {conducting ? 'Drawing...' : 'Conduct Draw'}
                </button>
              )}

            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-8 pt-7 border-t border-white/10">

            <HeroStat
              icon={Users}
              value={draw.totalEntries || draw.entryCount || 0}
              label="Entries"
            />

            <HeroStat
              icon={Trophy}
              value={draw.prizes?.length || 0}
              label="Prizes"
            />

            <HeroStat
              icon={CalendarDays}
              value={new Date(draw.startDate).toLocaleDateString()}
              label="Start Date"
            />

            <HeroStat
              icon={Clock}
              value={new Date(draw.endDate).toLocaleDateString()}
              label="End Date"
            />

          </div>
        </div>
      </section>

      {/* =========================================================
          MY TICKETS
      ========================================================= */}
      {draw.userEntries?.length > 0 && (
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-50 via-white to-indigo-50 border border-violet-100 shadow-sm">

          <div className="absolute top-0 right-0 w-40 h-40 bg-violet-200/30 rounded-full blur-3xl" />

          <div className="relative p-5 sm:p-6">

            <div className="flex items-center justify-between gap-4 mb-5">

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                  <Ticket className="w-5 h-5 text-violet-600" />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    My Tickets
                  </h3>

                  <p className="text-xs text-slate-500">
                    Your entries for this draw
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-bold">
                {draw.userEntries.length} Ticket
                {draw.userEntries.length !== 1 ? 's' : ''}
              </span>

            </div>

            <div className="flex flex-wrap gap-3">
              {draw.userEntries.map((e) => (
                <div
                  key={e._id}
                  className="group flex items-center gap-2 px-4 py-2.5 bg-white border border-violet-100 rounded-xl shadow-sm hover:shadow-md hover:border-violet-300 transition-all"
                >
                  <Hash className="w-3.5 h-3.5 text-violet-400" />

                  <span className="font-mono text-sm font-semibold text-slate-700">
                    {e.ticketNumber}
                  </span>

                  {e.isWinner && (
                    <Crown className="w-4 h-4 text-amber-500" />
                  )}
                </div>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* =========================================================
          WINNERS
      ========================================================= */}
      {(winners || draw.status === 'completed') && (
        <section className="relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 shadow-sm">

          <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-amber-200/30 blur-3xl" />

          <div className="relative p-5 sm:p-6">

            <div className="flex items-center gap-3 mb-6">

              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-300/30">
                <Award className="w-6 h-6 text-white" />
              </div>

              <div>
                <h3 className="font-bold text-amber-900 text-lg">
                  Winners
                </h3>

                <p className="text-xs text-amber-700/70">
                  Congratulations to the lucky winners
                </p>
              </div>

            </div>

            <div className="space-y-3">

              {(winners || draw.prizes?.filter((p) => p.winner))?.map(
                (w, i) => {
                  const prize = winners ? w : draw.prizes[i];

                  const userName = winners
                    ? w.user?.name
                    : prize.winner?.name;

                  const ticket = winners
                    ? w.ticketNumber
                    : null;

                  const rank = winners
                    ? w.rank
                    : prize.rank;

                  return (
                    <div
                      key={i}
                      className="group flex items-center gap-4 p-4 bg-white/90 border border-amber-100 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
                    >

                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white shadow-sm ${
                          rank === 1
                            ? 'bg-gradient-to-br from-amber-400 to-yellow-500'
                            : rank === 2
                            ? 'bg-gradient-to-br from-slate-400 to-slate-500'
                            : 'bg-gradient-to-br from-orange-400 to-orange-600'
                        }`}
                      >
                        #{rank}
                      </div>

                      <div className="flex-1 min-w-0">

                        <p className="font-bold text-slate-900 truncate">
                          {userName || 'Winner'}
                        </p>

                        <div className="flex items-center gap-2 mt-1">
                          <Gift className="w-3.5 h-3.5 text-amber-500" />

                          <p className="text-sm text-slate-500 truncate">
                            {winners ? w.prize : prize.title}
                          </p>
                        </div>

                      </div>

                      {ticket && (
                        <span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg">
                          <Ticket className="w-3 h-3" />
                          {ticket}
                        </span>
                      )}

                    </div>
                  );
                }
              )}

            </div>

            {draw.seed && (
              <div className="flex items-center gap-2 mt-5 pt-4 border-t border-amber-100">
                <ShieldCheck className="w-4 h-4 text-amber-500" />

                <p className="text-xs text-slate-400">
                  Verification seed:{' '}
                  <span className="font-mono text-slate-500">
                    {draw.seed.substring(0, 16)}...
                  </span>
                </p>
              </div>
            )}

          </div>
        </section>
      )}

      {/* =========================================================
          PRIZES
      ========================================================= */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        <div className="p-5 sm:p-6 border-b border-slate-100">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
              <Gift className="w-5 h-5 text-violet-600" />
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                Prizes
              </h3>

              <p className="text-xs text-slate-500">
                Rewards available in this draw
              </p>
            </div>

          </div>

        </div>

        <div className="p-5 sm:p-6">

          <div className="grid gap-3">

            {draw.prizes?.map((prize, i) => (
              <div
                key={i}
                className="group flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-violet-50/50 hover:border-violet-100 transition-all"
              >

                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm ${
                    prize.rank === 1
                      ? 'bg-amber-100 text-amber-700'
                      : prize.rank === 2
                      ? 'bg-slate-200 text-slate-600'
                      : 'bg-orange-100 text-orange-700'
                  }`}
                >
                  #{prize.rank}
                </div>

                <div className="flex-1 min-w-0">

                  <p className="font-semibold text-slate-900">
                    {prize.title}
                  </p>

                  {prize.description && (
                    <p className="text-sm text-slate-500 mt-0.5">
                      {prize.description}
                    </p>
                  )}

                </div>

                {prize.value && (
                  <span className="shrink-0 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-sm font-bold text-emerald-600">
                    {prize.value}
                  </span>
                )}

              </div>
            ))}

          </div>

        </div>
      </section>

      {/* =========================================================
          RULES
      ========================================================= */}
      {draw.rules && (
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          <div className="p-5 sm:p-6 border-b border-slate-100">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-slate-600" />
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  Rules & Guidelines
                </h3>

                <p className="text-xs text-slate-500">
                  Please review before participating
                </p>
              </div>

            </div>

          </div>

          <div className="p-5 sm:p-6">
            <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 sm:p-5">
              <pre className="text-sm text-slate-600 whitespace-pre-wrap font-sans leading-7">
                {draw.rules}
              </pre>
            </div>
          </div>

        </section>
      )}

      {/* =========================================================
          PARTICIPANTS
      ========================================================= */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        <div className="p-5 sm:p-6 border-b border-slate-100">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-indigo-600" />
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  Participants
                </h3>

                <p className="text-xs text-slate-500">
                  People participating in this draw
                </p>
              </div>

            </div>

            <span className="inline-flex items-center self-start sm:self-auto px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
              {entries.length} Participants
            </span>

          </div>

        </div>

        <div className="p-4 sm:p-6">

          {entries.length > 0 ? (
            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead>
                  <tr className="border-b border-slate-100 text-left">

                    <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      #
                    </th>

                    <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Participant
                    </th>

                    <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Ticket
                    </th>

                    <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Status
                    </th>

                    <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Joined
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {entries.map((e, i) => (
                    <tr
                      key={e._id}
                      className="group border-b border-slate-50 last:border-0 hover:bg-slate-50/70 transition-colors"
                    >

                      <td className="px-3 py-4">
                        <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-semibold">
                          {i + 1}
                        </span>
                      </td>

                      <td className="px-3 py-4">

                        <div className="flex items-center gap-3">

                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                            {e.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>

                          <span className="font-semibold text-slate-800">
                            {e.user?.name || 'Unknown User'}
                          </span>

                        </div>

                      </td>

                      <td className="px-3 py-4">

                        <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1.5 rounded-lg">
                          <Ticket className="w-3 h-3 text-violet-500" />
                          {e.ticketNumber}
                        </span>

                      </td>

                      <td className="px-3 py-4">

                        {e.isWinner ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-xs font-semibold">
                            <Crown className="w-3.5 h-3.5" />
                            Winner #{e.prizeRank}
                          </span>
                        ) : (
                          <span className="inline-flex px-2.5 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold capitalize">
                            {e.status}
                          </span>
                        )}

                      </td>

                      <td className="px-3 py-4 text-xs text-slate-400 whitespace-nowrap">
                        {new Date(e.createdAt).toLocaleString()}
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          ) : (
            <div className="py-14 text-center">

              <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-slate-400" />
              </div>

              <h4 className="font-semibold text-slate-700">
                No participants yet
              </h4>

              <p className="text-sm text-slate-400 mt-1">
                Be the first person to join this lucky draw.
              </p>

            </div>
          )}

        </div>
      </section>

    </div>
  );
};

/* =========================================================
   HERO STAT
========================================================= */

const HeroStat = ({ icon: Icon, value, label }) => {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">

      <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-violet-200" />
      </div>

      <div className="min-w-0">

        <p className="text-white font-bold text-sm truncate">
          {value}
        </p>

        <p className="text-slate-400 text-[11px]">
          {label}
        </p>

      </div>

    </div>
  );
};

export default DrawDetail;


