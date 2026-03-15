import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlan } from '../hooks/usePlan.js';

export default function VideoSelector() {
  const navigate = useNavigate();
  const { generate, loading, error } = usePlan();
  const [videos,   setVideos]   = useState([]);
  const [selected, setSelected] = useState(new Set());

  useEffect(() => {
    const h = sessionStorage.getItem('wknd_history');
    const p = sessionStorage.getItem('wknd_prefs');
    if (!h || !p) { navigate('/plan'); return; }
    const parsed = JSON.parse(h);
    setVideos(parsed);
    setSelected(new Set(parsed.map((_, i) => i)));
  }, [navigate]);

  const toggle = (i) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const selectAll   = () => setSelected(new Set(videos.map((_, i) => i)));
  const deselectAll = () => setSelected(new Set());

  const handleGenerate = async () => {
    const prefs   = JSON.parse(sessionStorage.getItem('wknd_prefs'));
    const history = videos.filter((_, i) => selected.has(i));
    const plan    = await generate(history, prefs);
    if (plan) {
      sessionStorage.setItem('wknd_plan', JSON.stringify(plan));
      navigate('/results');
    }
  };

  const selectedCount = selected.size;

  return (
    <main className="max-w-lg mx-auto px-6 py-10 pb-24">
      <button onClick={() => navigate('/plan')}
        className="text-xs text-muted hover:text-ink transition-colors mb-6 flex items-center gap-1">
        ← Back
      </button>

      <div className="mb-6 animate-fade-up">
        <div className="section-label">Step 2 — Your liked videos</div>
        <div class="section-title">PICK YOUR CONTEXT</div>
        <p className="text-sm text-muted mt-2 leading-relaxed">
          All your liked videos are selected. Uncheck anything that's not relevant — memes, random stuff, whatever.
        </p>
      </div>

      {/* Stats + controls */}
      <div className="flex items-center justify-between mb-4 animate-fade-up animate-fade-up-delay-1">
        <span className="text-sm font-medium">
          {selectedCount} of {videos.length} selected
        </span>
        <div className="flex gap-3">
          <button onClick={selectAll}   className="text-xs text-muted hover:text-ink underline underline-offset-2">Select all</button>
          <button onClick={deselectAll} className="text-xs text-muted hover:text-ink underline underline-offset-2">Deselect all</button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-6">
          {error}
        </div>
      )}

      {/* Video list */}
      <div className="flex flex-col gap-2 mb-8 animate-fade-up animate-fade-up-delay-2">
        {videos.map((v, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className={`flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all ${
              selected.has(i)
                ? 'border-ink bg-white'
                : 'border-border bg-bg opacity-50'
            }`}
          >
            {/* Checkbox */}
            <div className={`w-5 h-5 rounded shrink-0 mt-0.5 border-2 flex items-center justify-center transition-all ${
              selected.has(i) ? 'bg-ink border-ink' : 'border-border'
            }`}>
              {selected.has(i) && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>

            <div className="min-w-0">
              <div className="text-sm font-medium text-ink leading-snug truncate">
                {v.title || 'Untitled'}
              </div>
              <div className="text-xs text-muted mt-0.5">
                {v.channelTitle || 'Unknown channel'}
              </div>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading || selectedCount === 0}
        className="btn-accent disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading
          ? <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" /> Building your plan…</>
          : `✦ BUILD PLAN WITH ${selectedCount} VIDEOS`
        }
      </button>
    </main>
  );
}