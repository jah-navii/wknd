import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Landing() {
  const { signIn, error } = useAuth();
  const navigate = useNavigate();
  const [signingIn, setSigningIn] = useState(false);

  const handleSignIn = async () => {
    setSigningIn(true);
    try {
      const user = await signIn();
      if (user) navigate('/plan');
    } catch {
      // error is set in context
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-72px)] flex flex-col items-center justify-center px-6 py-16 text-center gap-8">
      {/* Headline */}
      <div className="animate-fade-up">
        <h1 className="font-display text-[clamp(4rem,13vw,9rem)] leading-[0.9] tracking-wide">
          YOUR<br />
          <span className="font-serif-italic text-accent" style={{ fontSize: '0.75em' }}>
            perfect
          </span>
          <br />
          WEEKEND
        </h1>
      </div>

      {/* Subtext */}
      <p className="animate-fade-up animate-fade-up-delay-1 text-muted max-w-sm leading-relaxed font-light text-base">
        Connect your YouTube. We'll figure out what you're into and build a
        weekend plan that actually matches your vibe.
      </p>

      {/* CTA */}
      <div className="animate-fade-up animate-fade-up-delay-2 flex flex-col items-center gap-3">
        <button
          onClick={handleSignIn}
          disabled={signingIn}
          className="btn-primary text-base px-7 py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {/* Google logo */}
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {signingIn ? 'Connecting…' : 'Connect with Google'}
        </button>

        <span className="flex items-center gap-2 text-xs text-muted bg-white border border-border rounded-full px-4 py-2">
          <span className="text-red-500">▶</span>
          Reads your YouTube history via Google OAuth
        </span>
      </div>

      {error && (
        <p className="text-sm text-accent bg-red-50 border border-red-200 rounded-xl px-4 py-3 max-w-sm">
          {error}
        </p>
      )}
    </main>
  );
}
