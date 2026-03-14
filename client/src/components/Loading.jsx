export default function Loading({ message = 'Loading…' }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5">
      <div className="w-12 h-12 border-2 border-border border-t-accent rounded-full animate-spin" />
      <p className="text-sm text-muted">{message}</p>
    </div>
  );
}
