import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Header from './components/Header.jsx';
import Landing from './pages/Landing.jsx';
import Prefs from './pages/Prefs.jsx';
import Results from './pages/Results.jsx';
import Loading from './components/Loading.jsx';
import YouTubeDebug from './pages/YoutubeDebug.jsx';
import DrillDown from './pages/DrillDown.jsx';
import VideoSelector from './pages/VideoSelector.jsx';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return <Loading message="Starting up…" />;

  return (
    <div className="min-h-screen">
      <Header />
      <Routes>
        <Route path="/"        element={!user ? <Landing /> : <Navigate to="/plan" replace />} />
        <Route path="/plan"    element={user  ? <Prefs />   : <Navigate to="/" replace />} />
        <Route path="/results" element={user  ? <Results /> : <Navigate to="/" replace />} />
        <Route path="/yt-debug" element={user ? <YouTubeDebug /> : <Navigate to="/" replace />} />
        <Route path="/drill"   element={user  ? <DrillDown /> : <Navigate to="/" replace />} />
        <Route path="/select" element={user ? <VideoSelector /> : <Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}


