import { useState, useCallback } from 'react';
import { api } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export function useYouTube() {
  const { getTokens } = useAuth();
  const [history, setHistory]   = useState([]);
  const [source, setSource]     = useState(null); // 'activities' | 'liked'
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getHistory(getTokens());
      setHistory(data.items || []);
      setSource(data.source);
      return data.items || [];
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [getTokens]);

  return { history, source, loading, error, fetchHistory };
}
