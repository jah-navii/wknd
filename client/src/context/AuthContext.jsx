import { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]               = useState(null);
  const [accessToken, setAccessToken] = useState(() => sessionStorage.getItem('yt_access_token'));
  const [idToken, setIdToken]         = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const token = await firebaseUser.getIdToken();
        setIdToken(token);
      } else {
        setUser(null);
        setIdToken(null);
        setAccessToken(null);
        sessionStorage.removeItem('yt_access_token');
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const signIn = async () => {
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        setAccessToken(credential.accessToken);
        sessionStorage.setItem('yt_access_token', credential.accessToken);
      }
      return result.user;
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') return null;
      setError(err.message || 'Sign-in failed');
      throw err;
    }
  };

  const signOut = () => {
    sessionStorage.removeItem('yt_access_token');
    return firebaseSignOut(auth);
  };

  const getTokens = () => ({ idToken, accessToken });

  return (
    <AuthContext.Provider value={{ user, idToken, accessToken, loading, error, signIn, signOut, getTokens }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};