import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ActivityCard from '../components/ActivityCard.jsx';

const VIBE_LABELS = {
  go_out: 'Going Out', stay_in: 'Stay In', active: 'Active', social: 'Social',
};

export default function Results() {
  const navigate = useNavigate();
  const [plan,  setPlan]  = useState(null);
  const [prefs, setPrefs] = useState(null);

  useEffect(() => {
    const p = sessionStorage.getItem('wknd_plan');
    const r = sessionStorage.getItem('wknd_prefs');
    if (!p) { navigate('/plan'); return; }
    setPlan(JSON.parse(p));
    if (r) setPrefs(JSON.parse(r));
  }, [navigate]);

  if (!plan) return null;

  return (
    <main className="max-w-2xl mx-auto px-6 py-10 pb-24">
      {/* Header */}
      <div className="mb-6 animate-fade-up">
        <h1 className="font-display text-[clamp(2.5rem,8vw,5rem)] leading-none tracking-wide">
          {plan.planTitle?.toUpperCase() || 'YOUR WEEKEND PLAN'}
        </h1>
        {prefs && (
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-xs bg-white border border-border rounded-full px-3 py-1">
              ⏱ {prefs.duration}h
            </span>
            <span className="text-xs bg-white border border-border rounded-full px-3 py-1">
              ⚡ {prefs.energy}
            </span>
            <span className="text-xs bg-white border border-border rounded-full px-3 py-1">
              💰 {prefs.budget}
            </span>
            {(prefs.vibes || []).map(v => (
              <span key={v} className="text-xs bg-white border border-border rounded-full px-3 py-1">
                {VIBE_LABELS[v] || v}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Interest tags */}
      {plan.interests?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8 animate-fade-up animate-fade-up-delay-1">
          {plan.interests.map(tag => (
            <span
              key={tag}
              className="bg-ink text-bg text-xs font-medium tracking-wide rounded-md px-2.5 py-1"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Activity cards */}
      <div className="flex flex-col gap-4">
        {(plan.activities || []).map((activity, i) => (
          <ActivityCard key={i} activity={activity} index={i} />
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mt-10">
        <button className="btn-ghost" onClick={() => navigate('/plan')}>
          ↺ Change preferences
        </button>
        <button
          className="btn-ghost"
          onClick={() => {
            sessionStorage.removeItem('wknd_plan');
            navigate('/plan');
          }}
        >
          ⟳ Regenerate
        </button>
      </div>
    </main>
  );
}
