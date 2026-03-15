const TYPE_CONFIG = {
  go_out:  { label: 'Go Out',  accent: '#e8411a', bg: '#fdf0ed', text: '#c0341a' },
  stay_in: { label: 'Stay In', accent: '#2d6a4f', bg: '#edf5f1', text: '#235c41' },
  active:  { label: 'Active',  accent: '#e76f51', bg: '#fdf2ee', text: '#c05a3e' },
  social:  { label: 'Social',  accent: '#457b9d', bg: '#edf3f8', text: '#356480' },
};

export default function BroadCard({ activity, index, onClick }) {
  const config = TYPE_CONFIG[activity.type] || TYPE_CONFIG.stay_in;
  const delay  = `animate-fade-up-delay-${Math.min(index + 2, 5)}`;

  return (
    <button
      onClick={onClick}
      className={`card w-full text-left relative overflow-hidden group cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all animate-fade-up ${delay}`}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
        style={{ backgroundColor: config.accent }} />

      <div className="pl-2">
        {/* Type badge */}
        <div className="mb-3">
          <span className="text-xs font-semibold tracking-wide px-2.5 py-1 rounded-full"
            style={{ backgroundColor: config.bg, color: config.text }}>
            {config.label}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-xl text-ink mb-2 leading-tight">
          {activity.title}
        </h3>

        {/* Hook */}
        <p className="text-sm text-muted leading-relaxed font-light mb-3">
          {activity.hook}
        </p>

        {/* Tags */}
        {activity.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {activity.tags.map(tag => (
              <span key={tag}
                className="text-xs px-2 py-0.5 rounded-md bg-bg border border-border text-muted font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Why */}
        {activity.why && (
          <p className="text-xs text-muted italic border-t border-border pt-3 mb-3">
            Based on: {activity.why}
          </p>
        )}

        {/* CTA */}
        <div className="text-xs font-semibold tracking-wide group-hover:underline"
          style={{ color: config.accent }}>
          Tap for your specific plan →
        </div>
      </div>
    </button>
  );
}