import { useState, useCallback } from 'react';
import { api } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export function usePlan() {
  const { getTokens } = useAuth();
  const [plan, setPlan]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const generate = useCallback(async (watchHistory, prefs) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.generatePlan({ watchHistory, prefs }, getTokens());
      setPlan(result);
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [getTokens]);

  const reset = () => setPlan(null);

  return { plan, loading, error, generate, reset };
}
