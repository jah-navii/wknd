import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlan } from '../hooks/usePlan.js';
import Loading from '../components/Loading.jsx';

const TYPE_CONFIG = {
  go_out:  { accent: '#e8411a', bg: '#fdf0ed', text: '#c0341a', label: 'Go Out' },
  stay_in: { accent: '#2d6a4f', bg: '#edf5f1', text: '#235c41', label: 'Stay In' },
  active:  { accent: '#e76f51', bg: '#fdf2ee', text: '#c05a3e', label: 'Active' },
  social:  { accent: '#457b9d', bg: '#edf3f8', text: '#356480', label: 'Social' },
};

function getLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      ()  => resolve(null),
      { timeout: 6000 }
    );
  });
}

export default function DrillDown() {
  const navigate = useNavigate();
  const { drill, loading } = usePlan();
  const [detail,   setDetail]   = useState(null);
  const [activity, setActivity] = useState(null);
  const [error,    setError]    = useState(null);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    const stored  = sessionStorage.getItem('wknd_selected');
    const planRaw = sessionStorage.getItem('wknd_plan');
    if (!stored) { navigate('/results'); return; }

    const act       = JSON.parse(stored);
    const interests = planRaw ? JSON.parse(planRaw).interests || [] : [];
    setActivity(act);

    const run = async () => {
      setLocating(true);
      const loc = await getLocation();
      setLocating(false);
      const result = await drill(act, interests, loc?.lat, loc?.lng);
      if (result) setDetail(result);
      else setError('Could not generate a plan. Try again.');
    };
    run();
  }, []);

  const config = TYPE_CONFIG[activity?.type] || TYPE_CONFIG.stay_in;
  const isGoOut = ['go_out', 'active', 'social'].includes(activity?.type);

  if (locating || loading) {
    return <Loading message={locating ? 'Getting your location…' : 'Building your specific plan…'} />;
  }

  if (error) return (
    <main className="max-w-lg mx-auto px-6 py-10 text-center">
      <p className="text-accent mb-4">{error}</p>
      <button className="btn-ghost" onClick={() => navigate('/results')}>← Back</button>
    </main>
  );

  if (!detail) return null;

  return (
    <main className="max-w-lg mx-auto px-6 py-10 pb-24">
      <button onClick={() => navigate('/results')}
        className="text-xs text-muted hover:text-ink transition-colors mb-6 flex items-center gap-1">
        ← Back to ideas
      </button>

      <div className="mb-6 animate-fade-up">
        <span className="text-xs font-semibold tracking-wide px-3 py-1 rounded-full mb-3 inline-block"
          style={{ backgroundColor: config.bg, color: config.text }}>
          {config.label}
        </span>
        <h1 className="font-display text-4xl tracking-wide leading-none mt-2">
          {detail.title?.toUpperCase()}
        </h1>
        <p className="text-sm text-muted mt-3 leading-relaxed font-light">{detail.overview}</p>
        <div className="text-xs text-muted mt-2">⏱ {detail.timeEstimate}</div>
      </div>

      {detail.steps?.length > 0 && (
        <section className="mb-8 animate-fade-up animate-fade-up-delay-1">
          <div className="section-label">Your plan</div>
          <div className="flex flex-col gap-3">
            {detail.steps.map((s, i) => (
              <div key={i} className="card flex gap-4">
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white mt-0.5"
                  style={{ backgroundColor: config.accent }}>{i + 1}</div>
                <div>
                  <div className="font-semibold text-sm mb-1">{s.step}</div>
                  <div className="text-xs text-muted leading-relaxed">{s.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {isGoOut && detail.places?.length > 0 && (
        <section className="mb-8 animate-fade-up animate-fade-up-delay-2">
          <div className="section-label">Nearby spots</div>
          <div className="flex flex-col gap-3">
            {detail.places.map((p, i) => (
              <div key={i} className="card">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="font-semibold text-sm">{p.name}</div>
                  <span className="text-xs px-2 py-0.5 rounded-full shrink-0"
                    style={{ backgroundColor: config.bg, color: config.text }}>📍 Nearby</span>
                </div>
                <div className="text-xs text-muted mb-2">{p.reason}</div>
                {p.tip && <div className="text-xs italic text-muted border-t border-border pt-2">💡 {p.tip}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {!isGoOut && detail.shoppingList?.length > 0 && (
        <section className="mb-8 animate-fade-up animate-fade-up-delay-2">
          <div className="section-label">What you'll need</div>
          <div className="flex flex-col gap-2">
            {detail.shoppingList.map((item, i) => (
              <div key={i} className="card flex items-start gap-3">
                <span className="text-lg">🛒</span>
                <div>
                  <div className="font-semibold text-sm">{item.item}</div>
                  <div className="text-xs text-muted">{item.why}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {detail.tips?.length > 0 && (
        <section className="mb-8 animate-fade-up animate-fade-up-delay-3">
          <div className="section-label">Quick tips</div>
          <div className="card flex flex-col gap-2">
            {detail.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-muted py-1 border-b border-border last:border-0">
                <span style={{ color: config.accent }}>✦</span>{tip}
              </div>
            ))}
          </div>
        </section>
      )}

      <button className="btn-ghost w-full justify-center" onClick={() => navigate('/results')}>
        ← See other ideas
      </button>
    </main>
  );
}