import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BroadCard from '../components/BroadCard.jsx';

export default function Results() {
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    const p = sessionStorage.getItem('wknd_plan');
    if (!p) { navigate('/plan'); return; }
    setPlan(JSON.parse(p));
  }, [navigate]);

  if (!plan) return null;

  const handleCardClick = (activity) => {
    sessionStorage.setItem('wknd_selected', JSON.stringify(activity));
    navigate('/drill');
  };

  return (
    <main className="max-w-lg mx-auto px-6 py-10 pb-24">
      <div className="mb-6 animate-fade-up">
        <div className="section-label">Your weekend, curated</div>
        <h1 className="font-display text-5xl tracking-wide leading-none">
          {plan.planTitle?.toUpperCase() || 'YOUR PLAN'}
        </h1>
      </div>

      {plan.interests?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6 animate-fade-up animate-fade-up-delay-1">
          {plan.interests.map(tag => (
            <span key={tag} className="bg-ink text-bg text-xs font-medium tracking-wide rounded-md px-2.5 py-1">
              {tag}
            </span>
          ))}
        </div>
      )}

      <p className="text-sm text-muted mb-6 animate-fade-up animate-fade-up-delay-1">
        Tap a card to get a specific plan 👇
      </p>

      <div className="flex flex-col gap-4">
        {(plan.activities || []).map((activity, i) => (
          <BroadCard key={i} activity={activity} index={i} onClick={() => handleCardClick(activity)} />
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mt-10">
        <button className="btn-ghost" onClick={() => navigate('/plan')}>↺ Change preferences</button>
        <button className="btn-ghost" onClick={() => { sessionStorage.removeItem('wknd_plan'); navigate('/plan'); }}>
          ⟳ Regenerate
        </button>
      </div>
    </main>
  );
}