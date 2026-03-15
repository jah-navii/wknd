import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useYouTube } from '../hooks/useYouTube.js';

const WHERE = [
  { id: 'stay_in', label: '🏠 Stay In' },
  { id: 'go_out',  label: '🌇 Go Out' },
];

const WHO = [
  { id: 'solo',        label: '🙋 Solo' },
  { id: 'with_people', label: '👥 With People' },
];

const MOOD = [
  { id: 'chill',       label: '😌 Chill' },
  { id: 'productive',  label: '🎯 Productive' },
  { id: 'adventurous', label: '🔥 Adventurous' },
];

const DURATION = [
  { id: 'couple_hours', label: '⏱ Couple Hours' },
  { id: 'half_day',     label: '🌤 Half Day' },
  { id: 'full_day',     label: '☀️ Full Day' },
];

function MultiChips({ options, selected, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => (
        <button
          key={o.id}
          onClick={() => onToggle(o.id)}
          className={`chip ${selected.includes(o.id) ? 'chip-selected' : ''}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function Prefs() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const { history, loading: ytLoading, error: ytError, fetchHistory } = useYouTube();

  const [where,    setWhere]    = useState(['go_out']);
  const [who,      setWho]      = useState(['solo']);
  const [mood,     setMood]     = useState(['chill']);
  const [duration, setDuration] = useState(['couple_hours']);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const toggle = (setter) => (id) =>
    setter(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]);

  const canProceed = where.length > 0 && who.length > 0 && mood.length > 0 && duration.length > 0;

  const handleNext = () => {
    if (!canProceed) return;
    sessionStorage.setItem('wknd_history', JSON.stringify(history));
    sessionStorage.setItem('wknd_prefs',   JSON.stringify({ where, who, mood, duration }));
    navigate('/select');
  };

  return (
    <main className="max-w-lg mx-auto px-6 py-10 pb-20">
      <div className="mb-8 animate-fade-up">
        <div className="section-label">Step 1 — Preferences</div>
        <div className="section-title">BUILD MY WEEKEND</div>
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
            {ytLoading && 'Loading your liked videos…'}
            {!ytLoading && ytError && <span className="text-accent">{ytError}</span>}
            {!ytLoading && !ytError && history.length > 0 && `${history.length} liked videos loaded ✓`}
            {!ytLoading && !ytError && history.length === 0 && 'No liked videos found'}
          </div>
        </div>
      </div>

      <section className="mb-7 animate-fade-up animate-fade-up-delay-2">
        <div className="section-label">Where?</div>
        <MultiChips options={WHERE} selected={where} onToggle={toggle(setWhere)} />
      </section>

      <section className="mb-7 animate-fade-up animate-fade-up-delay-2">
        <div className="section-label">Who with?</div>
        <MultiChips options={WHO} selected={who} onToggle={toggle(setWho)} />
      </section>

      <section className="mb-7 animate-fade-up animate-fade-up-delay-3">
        <div className="section-label">Mood?</div>
        <MultiChips options={MOOD} selected={mood} onToggle={toggle(setMood)} />
      </section>

      <section className="mb-10 animate-fade-up animate-fade-up-delay-3">
        <div className="section-label">How long?</div>
        <MultiChips options={DURATION} selected={duration} onToggle={toggle(setDuration)} />
      </section>

      <button
        onClick={handleNext}
        disabled={ytLoading || !canProceed}
        className="btn-accent disabled:opacity-50 disabled:cursor-not-allowed animate-fade-up animate-fade-up-delay-4"
      >
        {ytLoading
          ? <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" /> Loading videos…</>
          : '✦ PICK MY VIDEOS →'
        }
      </button>
    </main>
  );
}