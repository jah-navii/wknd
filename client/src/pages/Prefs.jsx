import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useYouTube } from '../hooks/useYouTube.js';
import { usePlan } from '../hooks/usePlan.js';

const VIBES = [
  { id: 'go_out',  label: '🌇 Go Out',     cls: 'chip-out' },
  { id: 'stay_in', label: '🏠 Stay In',    cls: 'chip-in' },
  { id: 'active',  label: '🏃 Get Active', cls: 'chip-active' },
  { id: 'social',  label: '👥 Social',     cls: 'chip-social' },
];

const MOODS = [
  { id: 'chill',       label: '😌 Chill' },
  { id: 'adventurous', label: '🔥 Adventurous' },
  { id: 'productive',  label: '🎯 Productive' },
  { id: 'social',      label: '🥳 Hang out' },
];

export default function Prefs() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { history, loading: ytLoading, error: ytError, fetchHistory } = useYouTube();
  const { generate, loading: planLoading, error: planError } = usePlan();

  const [vibes, setVibes] = useState(['go_out', 'stay_in']);
  const [vibe,  setVibe]  = useState('chill');

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const toggleVibe = (id) =>
    setVibes(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]);

  const handleGenerate = async () => {
    if (vibes.length === 0) return;
    sessionStorage.setItem('wknd_history', JSON.stringify(history));
    sessionStorage.setItem('wknd_prefs',   JSON.stringify({ vibes, vibe }));
    navigate('/select');
  };

  return (
    <main className="max-w-lg mx-auto px-6 py-10 pb-20">
      <div className="mb-8 animate-fade-up">
        <div className="section-label">What are you feeling?</div>
        <div className="section-title">BUILD MY WEEKEND</div>
      </div>

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

      {planError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-6">
          {planError}
        </div>
      )}

      <section className="mb-8 animate-fade-up animate-fade-up-delay-2">
        <div className="section-label">I want to…</div>
        <div className="flex flex-wrap gap-2">
          {VIBES.map(v => (
            <button key={v.id} onClick={() => toggleVibe(v.id)}
              className={`chip ${v.cls} ${vibes.includes(v.id) ? 'chip-selected' : ''}`}>
              {v.label}
            </button>
          ))}
        </div>
      </section>

      <section className="mb-10 animate-fade-up animate-fade-up-delay-3">
        <div className="section-label">My vibe is…</div>
        <div className="flex flex-wrap gap-2">
          {MOODS.map(m => (
            <button key={m.id} onClick={() => setVibe(m.id)}
              className={`chip ${vibe === m.id ? 'chip-selected' : ''}`}>
              {m.label}
            </button>
          ))}
        </div>
      </section>

      <button onClick={handleGenerate} disabled={ytLoading || vibes.length === 0}
        className="btn-accent disabled:opacity-50 disabled:cursor-not-allowed animate-fade-up animate-fade-up-delay-4">
        {ytLoading
          ? <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" /> Loading videos…</>
          : '✦ PICK MY VIDEOS →'
        }
      </button>
    </main>
  );
}