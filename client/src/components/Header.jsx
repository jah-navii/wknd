import { useAuth } from '../context/AuthContext.jsx';

export default function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="px-6 md:px-10 py-5 flex items-center justify-between border-b-2 border-ink">
      <a href="/" className="font-display text-3xl tracking-wide text-ink leading-none no-underline">
        WKND<span className="text-accent">.</span>
      </a>
      <div className="flex items-center gap-4">
        <span className="text-xs tracking-widest uppercase text-muted hidden sm:block">
          Your Weekend, Planned
        </span>
        {user && (
          <button
            onClick={signOut}
            className="text-xs text-muted border border-border rounded-full px-3 py-1.5 hover:border-ink hover:text-ink transition-all"
          >
            Sign out
          </button>
        )}
      </div>
    </header>
  );
}
