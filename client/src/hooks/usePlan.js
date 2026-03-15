import { useState, useCallback } from 'react';
import { api } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export function usePlan() {
  const { getTokens } = useAuth();
  const [plan,    setPlan]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const generate = useCallback(async (watchHistory, prefs) => {
    setLoading(true); setError(null);
    try {
      const result = await api.generatePlan({ watchHistory, prefs }, getTokens());
      setPlan(result);
      return result;
    } catch (err) { setError(err.message); return null; }
    finally { setLoading(false); }
  }, [getTokens]);

  const drill = useCallback(async (activity, interests, lat, lng) => {
    setLoading(true); setError(null);
    try {
      return await api.drillDown({ activity, interests, lat, lng }, getTokens());
    } catch (err) { setError(err.message); return null; }
    finally { setLoading(false); }
  }, [getTokens]);

  return { plan, loading, error, generate, drill, reset: () => setPlan(null) };
}