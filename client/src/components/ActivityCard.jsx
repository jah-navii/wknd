const TYPE_CONFIG = {
  go_out:  { label: 'Go Out',   accent: '#e8411a', bg: '#fdf0ed', text: '#c0341a' },
  stay_in: { label: 'Stay In',  accent: '#2d6a4f', bg: '#edf5f1', text: '#235c41' },
  active:  { label: 'Active',   accent: '#e76f51', bg: '#fdf2ee', text: '#c05a3e' },
  social:  { label: 'Social',   accent: '#457b9d', bg: '#edf3f8', text: '#356480' },
};

export default function ActivityCard({ activity, index }) {
  const config = TYPE_CONFIG[activity.type] || TYPE_CONFIG.stay_in;
  const delay  = `animate-fade-up-delay-${Math.min(index + 1, 5)}`;

  return (
    <div
      className={`card relative overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all animate-fade-up ${delay}`}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
        style={{ backgroundColor: config.accent }}
      />

      <div className="pl-2">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <span
            className="text-xs font-semibold tracking-wide px-2.5 py-1 rounded-full"
            style={{ backgroundColor: config.bg, color: config.text }}
          >
            {config.label}
          </span>
          <span className="text-xs text-muted whitespace-nowrap">
            ⏱ {activity.duration}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-lg text-ink leading-tight mb-2">
          {activity.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted leading-relaxed font-light">
          {activity.description}
        </p>

        {/* Why */}
        {activity.why && (
          <div className="mt-3 pt-3 border-t border-border text-xs text-muted italic">
            <span className="font-medium not-italic text-ink">Why you'll love it: </span>
            {activity.why}
          </div>
        )}
      </div>
    </div>
  );
}
