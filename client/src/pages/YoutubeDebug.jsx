import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../lib/api.js';

export default function YouTubeDebug() {
  const { getTokens } = useAuth();
  const [data, setData]     = useState(null);
  const [error, setError]   = useState(null);
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const result = await api.getHistory(getTokens());
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <div className="mb-6">
        <div className="section-label">Debug</div>
        <div className="section-title">YOUTUBE DATA</div>
      </div>

      <button onClick={fetch} disabled={loading} className="btn-primary mb-8">
        {loading ? 'Fetching…' : '▶ Fetch YouTube History'}
      </button>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}

      {data && (
        <div className="flex flex-col gap-4">
          {/* Summary */}
          <div className="card flex gap-6">
            <div>
              <div className="section-label">Source</div>
              <div className="font-semibold text-lg">{data.source}</div>
            </div>
            <div>
              <div className="section-label">Items returned</div>
              <div className="font-semibold text-lg">{data.items?.length ?? 0}</div>
            </div>
          </div>

          {/* Raw items */}
          <div className="card">
            <div className="section-label mb-3">Video list</div>
            <div className="flex flex-col gap-2">
              {data.items?.length === 0 && (
                <p className="text-sm text-muted">No items returned.</p>
              )}
              {data.items?.map((item, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                  <span className="text-xs text-muted w-5 pt-0.5 shrink-0">{i + 1}</span>
                  <div>
                    <div className="text-sm font-medium leading-snug">{item.title || '—'}</div>
                    <div className="text-xs text-muted mt-0.5">{item.channelTitle || 'Unknown channel'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Raw JSON */}
          <div className="card">
            <div className="section-label mb-3">Raw JSON response</div>
            <pre className="text-xs bg-gray-50 border border-border rounded-xl p-4 overflow-auto max-h-96 font-mono leading-relaxed">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </main>
  );
}