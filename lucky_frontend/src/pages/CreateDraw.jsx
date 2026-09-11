
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  Plus,
  Trash2,
  ArrowLeft,
  Sparkles,
  Gift,
  CalendarDays,
  Settings2,
  ShieldCheck,
  Ticket,
  Users,
  FileText,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import '../css/CreateDraw.css'

const CreateDraw = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'active',
    maxParticipants: 0,
    entryFee: 0,
    startDate: new Date().toISOString().slice(0, 16),
    endDate: '',
    allowMultipleEntries: false,
    maxEntriesPerUser: 1,
    rules: '',
    isPublic: true,
    prizes: [
      {
        rank: 1,
        title: '',
        description: '',
        value: '',
      },
    ],
  });

  const addPrize = () => {
    setForm({
      ...form,
      prizes: [
        ...form.prizes,
        {
          rank: form.prizes.length + 1,
          title: '',
          description: '',
          value: '',
        },
      ],
    });
  };

  const removePrize = (index) => {
    if (form.prizes.length <= 1) return;

    const prizes = form.prizes
      .filter((_, i) => i !== index)
      .map((p, i) => ({
        ...p,
        rank: i + 1,
      }));

    setForm({
      ...form,
      prizes,
    });
  };

  const updatePrize = (index, field, value) => {
    const prizes = [...form.prizes];

    prizes[index] = {
      ...prizes[index],
      [field]: value,
    };

    setForm({
      ...form,
      prizes,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.endDate) {
      toast.error('Title and end date are required');
      return;
    }

    if (form.prizes.some((p) => !p.title)) {
      toast.error('All prizes must have a title');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...form,
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
        maxParticipants: parseInt(form.maxParticipants) || 0,
        entryFee: parseFloat(form.entryFee) || 0,
        maxEntriesPerUser:
          parseInt(form.maxEntriesPerUser) || 1,
      };

      const res = await api.post('/draws', payload);

      toast.success('Draw created successfully!');

      navigate(`/draws/${res.data.data._id}`);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Failed to create draw'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">

      {/* =========================================================
          TOP NAVIGATION
      ========================================================= */}

      <div className="mb-6">

        <button
          onClick={() => navigate('/draws')}
          className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-violet-600 transition-colors"
        >
          <span className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center group-hover:bg-violet-50 group-hover:border-violet-200 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </span>

          Back to Draws
        </button>

      </div>

      {/* =========================================================
          HERO HEADER
      ========================================================= */}

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-violet-950 to-indigo-950 shadow-2xl mb-7">

        {/* Glow */}
        <div className="absolute -top-24 -right-20 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />

        <div className="relative p-6 sm:p-8">

          <div className="flex items-start gap-4">

            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-7 h-7 text-violet-300" />
            </div>

            <div>

              <p className="text-violet-300 text-xs font-bold uppercase tracking-[0.2em] mb-2">
                Lucky Draw Management
              </p>

              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Create Lucky Draw
              </h1>

              <p className="text-slate-300 mt-2 max-w-2xl text-sm sm:text-base">
                Set up a new giveaway, raffle or lucky draw with
                prizes, participants and custom rules.
              </p>

            </div>

          </div>

          {/* Progress-like info */}
          <div className="flex flex-wrap gap-3 mt-7">

            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs">
              <Gift className="w-4 h-4 text-violet-300" />
              Add Prizes
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs">
              <Users className="w-4 h-4 text-indigo-300" />
              Manage Participants
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              Secure Draw
            </div>

          </div>

        </div>
      </div>

      {/* =========================================================
          FORM
      ========================================================= */}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* =======================================================
            BASIC INFORMATION
        ======================================================= */}

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          <SectionHeader
            icon={FileText}
            title="Basic Information"
            subtitle="Set the main details for your lucky draw"
          />

          <div className="p-5 sm:p-6 space-y-5">

            {/* Title */}
            <FormField
              label="Draw Title"
              required
              hint="Give your lucky draw a memorable name"
            >
              <input
                className="premium-input"
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
                placeholder="e.g. iPhone 16 Giveaway"
                required
              />
            </FormField>

            {/* Description */}
            <FormField
              label="Description"
              hint="Briefly describe what participants can expect"
            >
              <textarea
                className="premium-input resize-none"
                rows="4"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                placeholder="Describe your giveaway..."
              />
            </FormField>

            {/* Status + Participants */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <FormField
                label="Draw Status"
                hint="Choose the initial state"
              >
                <div className="relative">

                  <Settings2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />

                  <select
                    className="premium-input pl-10 appearance-none"
                    value={form.status}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="draft">Draft</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="active">Active</option>
                  </select>

                </div>
              </FormField>

              <FormField
                label="Max Participants"
                hint="Set 0 for unlimited"
              >
                <div className="relative">

                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />

                  <input
                    type="number"
                    min="0"
                    className="premium-input pl-10"
                    value={form.maxParticipants}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        maxParticipants: e.target.value,
                      })
                    }
                  />

                </div>
              </FormField>

            </div>

          </div>
        </section>

        {/* =======================================================
            SCHEDULE & ENTRY
        ======================================================= */}

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          <SectionHeader
            icon={CalendarDays}
            title="Schedule & Entry Settings"
            subtitle="Configure dates and participant entry limits"
          />

          <div className="p-5 sm:p-6 space-y-5">

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <FormField
                label="Start Date"
                required
              >
                <div className="relative">

                  <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-500 pointer-events-none" />

                  <input
                    type="datetime-local"
                    className="premium-input pl-10"
                    value={form.startDate}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        startDate: e.target.value,
                      })
                    }
                    required
                  />

                </div>
              </FormField>

              <FormField
                label="End Date"
                required
              >
                <div className="relative">

                  <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500 pointer-events-none" />

                  <input
                    type="datetime-local"
                    className="premium-input pl-10"
                    value={form.endDate}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        endDate: e.target.value,
                      })
                    }
                    required
                  />

                </div>
              </FormField>

            </div>

            {/* Entry settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <FormField
                label="Max Entries / User"
                hint="Maximum tickets allowed per participant"
              >
                <div className="relative">

                  <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-500 pointer-events-none" />

                  <input
                    type="number"
                    min="1"
                    className="premium-input pl-10"
                    value={form.maxEntriesPerUser}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        maxEntriesPerUser: e.target.value,
                      })
                    }
                  />

                </div>
              </FormField>

              <FormField
                label="Entry Type"
                hint="Allow participants to enter more than once"
              >

                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      allowMultipleEntries:
                        !form.allowMultipleEntries,
                    })
                  }
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                    form.allowMultipleEntries
                      ? 'bg-violet-50 border-violet-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >

                  <div className="flex items-center gap-3">

                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        form.allowMultipleEntries
                          ? 'bg-violet-100 text-violet-600'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      <Ticket className="w-4 h-4" />
                    </div>

                    <div className="text-left">

                      <p className="text-sm font-semibold text-slate-800">
                        Multiple Entries
                      </p>

                      <p className="text-xs text-slate-500">
                        {form.allowMultipleEntries
                          ? 'Enabled'
                          : 'Disabled'}
                      </p>

                    </div>

                  </div>

                  <div
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      form.allowMultipleEntries
                        ? 'bg-violet-600'
                        : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                        form.allowMultipleEntries
                          ? 'translate-x-6'
                          : 'translate-x-1'
                      }`}
                    />
                  </div>

                </button>

              </FormField>

            </div>

            {/* Rules */}
            <FormField
              label="Rules & Guidelines"
              hint="Add any rules participants should follow"
            >
              <textarea
                className="premium-input resize-none"
                rows="5"
                value={form.rules}
                onChange={(e) =>
                  setForm({
                    ...form,
                    rules: e.target.value,
                  })
                }
                placeholder={`1. One entry per person
2. Winners will be selected randomly
3. Winners will be contacted after the draw`}
              />
            </FormField>

          </div>
        </section>

        {/* =======================================================
            PRIZES
        ======================================================= */}

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          <div className="p-5 sm:p-6 border-b border-slate-100">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-200/40">
                  <Gift className="w-5 h-5 text-white" />
                </div>

                <div>

                  <h3 className="font-bold text-slate-900">
                    Prizes
                  </h3>

                  <p className="text-xs text-slate-500 mt-0.5">
                    Add the rewards participants can win
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={addPrize}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-50 border border-violet-100 text-violet-700 text-sm font-semibold hover:bg-violet-100 hover:border-violet-200 transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Prize
              </button>

            </div>

          </div>

          <div className="p-5 sm:p-6 space-y-4">

            {form.prizes.map((prize, i) => (

              <div
                key={i}
                className="group relative rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 hover:border-violet-200 hover:bg-violet-50/30 transition-all"
              >

                {/* Prize top */}
                <div className="flex items-center justify-between mb-5">

                  <div className="flex items-center gap-3">

                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                        prize.rank === 1
                          ? 'bg-amber-100 text-amber-700'
                          : prize.rank === 2
                          ? 'bg-slate-200 text-slate-600'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      #{prize.rank}
                    </div>

                    <div>
                      <p className="font-semibold text-slate-800">
                        Prize #{prize.rank}
                      </p>

                      <p className="text-xs text-slate-400">
                        Reward details
                      </p>
                    </div>

                  </div>

                  {form.prizes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePrize(i)}
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 transition-all"
                      title="Remove prize"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                </div>

                {/* Prize fields */}
                <div className="space-y-4">

                  <input
                    className="premium-input bg-white"
                    placeholder="Prize title * — e.g. iPhone 16 Pro"
                    value={prize.title}
                    onChange={(e) =>
                      updatePrize(
                        i,
                        'title',
                        e.target.value
                      )
                    }
                    required
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                    <input
                      className="premium-input bg-white"
                      placeholder="Prize description"
                      value={prize.description}
                      onChange={(e) =>
                        updatePrize(
                          i,
                          'description',
                          e.target.value
                        )
                      }
                    />

                    <input
                      className="premium-input bg-white"
                      placeholder="Value — e.g. Rs. 50,000"
                      value={prize.value}
                      onChange={(e) =>
                        updatePrize(
                          i,
                          'value',
                          e.target.value
                        )
                      }
                    />

                  </div>

                </div>

              </div>

            ))}

          </div>

        </section>

        {/* =======================================================
            FINAL ACTIONS
        ======================================================= */}

        <div className="sticky bottom-4 z-20">

          <div className="p-3 sm:p-4 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl">

            <div className="flex flex-col sm:flex-row gap-3">

              <button
                type="button"
                onClick={() => navigate('/draws')}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 bg-white text-slate-600 font-semibold hover:bg-slate-50 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="group flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white font-bold shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:hover:translate-y-0"
              >

                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Create Draw
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}

              </button>

            </div>

          </div>

        </div>

      </form>
    </div>
  );
};

/* =========================================================
   SECTION HEADER
========================================================= */

const SectionHeader = ({
  icon: Icon,
  title,
  subtitle,
}) => {
  return (
    <div className="p-5 sm:p-6 border-b border-slate-100">

      <div className="flex items-center gap-3">

        <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
          <Icon className="w-5 h-5 text-violet-600" />
        </div>

        <div>

          <h3 className="font-bold text-slate-900">
            {title}
          </h3>

          {subtitle && (
            <p className="text-xs text-slate-500 mt-0.5">
              {subtitle}
            </p>
          )}

        </div>

      </div>

    </div>
  );
};

/* =========================================================
   FORM FIELD
========================================================= */

const FormField = ({
  label,
  required,
  hint,
  children,
}) => {
  return (
    <div>

      <div className="flex items-center justify-between gap-2 mb-2">

        <label className="text-sm font-semibold text-slate-700">
          {label}

          {required && (
            <span className="text-red-500 ml-1">*</span>
          )}
        </label>

      </div>

      {children}

      {hint && (
        <p className="text-[11px] text-slate-400 mt-1.5">
          {hint}
        </p>
      )}

    </div>
  );
};

export default CreateDraw;


