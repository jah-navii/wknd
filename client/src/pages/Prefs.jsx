import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useYouTube } from '../hooks/useYouTube.js';
import { usePlan } from '../hooks/usePlan.js';

const VIBES = [
  { id: 'go_out',  label: '🌇 Go Out',    cls: 'chip-out' },
  { id: 'stay_in', label: '🏠 Stay In',   cls: 'chip-in' },
  { id: 'active',  label: '🏃 Get Active', cls: 'chip-active' },
  { id: 'social',  label: '👥 Social',    cls: 'chip-social' },
];

const ENERGY = [
  { id: 'low',    label: '😌 Chill' },
  { id: 'medium', label: '⚡ Moderate' },
  { id: 'high',   label: '🔥 High Energy' },
];

const BUDGET = [
  { id: 'free',   label: '💸 Free' },
  { id: 'low',    label: '$ Low' },
  { id: 'medium', label: '$$ Medium' },
  { id: 'high',   label: '$$$ Splurge' },
];

export default function Prefs() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const { history, source, loading: ytLoading, error: ytError, fetchHistory } = useYouTube();
  const { generate, loading: planLoading, error: planError } = usePlan();

  const [vibes,    setVibes]    = useState(['go_out', 'stay_in', 'active', 'social']);
  const [duration, setDuration] = useState(3);
  const [energy,   setEnergy]   = useState('low');
  const [budget,   setBudget]   = useState('free');

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const toggleVibe = (id) => {
    setVibes(prev =>
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    if (vibes.length === 0) return;
    const plan = await generate(history, { vibes, duration, energy, budget });
    if (plan) {
      // Store plan in sessionStorage so Results page can access it
      sessionStorage.setItem('wknd_plan', JSON.stringify(plan));
      sessionStorage.setItem('wknd_prefs', JSON.stringify({ vibes, duration, energy, budget }));
      navigate('/results');
    }
  };

  const durationLabel = () => {
    if (duration >= 8) return `Full day (~${duration}h)`;
    return `${duration} hour${duration === 1 ? '' : 's'}`;
  };

  const loading = ytLoading || planLoading;

  return (
    <main className="max-w-2xl mx-auto px-6 py-10 pb-20">
      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <div className="section-label">Step 2 — Preferences</div>
        <div className="section-title">WHAT KIND OF WEEKEND?</div>
      </div>

      {/* User bar */}
      <div className="card flex items-center gap-4 mb-8 animate-fade-up animate-fade-up-delay-1">
        {user?.photoURL
          ? <img src={user.photoURL} alt="avatar" className="w-10 h-10 rounded-full border-2 border-accent object-cover" />
          : <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-semibold">
              {user?.displayName?.[0] || '?'}
            </div>
        }
        <div>
          <div className="font-semibold text-sm">{user?.displayName || user?.email}</div>
          <div className="text-xs text-muted">
            {ytLoading && 'Fetching watch history…'}
            {!ytLoading && ytError && <span className="text-accent">{ytError}</span>}
            {!ytLoading && !ytError && history.length > 0 &&
              `${history.length} videos loaded (${source}) ✓`
            }
            {!ytLoading && !ytError && history.length === 0 && 'No history found — will make a general plan'}
          </div>
        </div>
        <div className="ml-auto flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-600 rounded-full px-3 py-1 text-xs font-medium">
          <span>▶</span> YouTube
        </div>
      </div>

      {/* Error banner */}
      {planError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-6">
          {planError}
        </div>
      )}

      {/* Activity type */}
      <section className="mb-8 animate-fade-up animate-fade-up-delay-2">
        <div className="section-label">Activity Type</div>
        <div className="flex flex-wrap gap-2">
          {VIBES.map(v => (
            <button
              key={v.id}
              onClick={() => toggleVibe(v.id)}
              className={`chip ${v.cls} ${vibes.includes(v.id) ? 'chip-selected' : ''}`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </section>

      {/* Duration */}
      <section className="mb-8 animate-fade-up animate-fade-up-delay-2">
        <div className="section-label">How much time?</div>
        <div className="font-display text-5xl text-accent mb-3">
          {durationLabel()}
        </div>
        <input
          type="range" min="1" max="12" step="0.5" value={duration}
          onChange={e => setDuration(parseFloat(e.target.value))}
          className="w-full accent-ink mb-1"
          style={{ accentColor: '#1a1108' }}
        />
        <div className="flex justify-between text-xs text-muted">
          <span>1 hr</span><span>Half day</span><span>Full day</span>
        </div>
      </section>

      {/* Energy */}
      <section className="mb-8 animate-fade-up animate-fade-up-delay-3">
        <div className="section-label">Energy Level</div>
        <div className="flex flex-wrap gap-2">
          {ENERGY.map(e => (
            <button
              key={e.id}
              onClick={() => setEnergy(e.id)}
              className={`chip ${energy === e.id ? 'chip-selected' : ''}`}
            >
              {e.label}
            </button>
          ))}
        </div>
      </section>

      {/* Budget */}
      <section className="mb-10 animate-fade-up animate-fade-up-delay-4">
        <div className="section-label">Budget</div>
        <div className="flex flex-wrap gap-2">
          {BUDGET.map(b => (
            <button
              key={b.id}
              onClick={() => setBudget(b.id)}
              className={`chip ${budget === b.id ? 'chip-selected' : ''}`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </section>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={loading || vibes.length === 0}
        className="btn-accent disabled:opacity-50 disabled:cursor-not-allowed animate-fade-up animate-fade-up-delay-5"
      >
        {loading
          ? <>
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
              {ytLoading ? 'Loading history…' : 'Generating your plan…'}
            </>
          : <>
              ✦ GENERATE MY WEEKEND PLAN
            </>
        }
      </button>
    </main>
  );
}
