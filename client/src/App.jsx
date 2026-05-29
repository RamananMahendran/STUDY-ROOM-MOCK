import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Rooms from './pages/Rooms.jsx';
import Profile from './pages/Profile.jsx';
import Room from './pages/Room.jsx';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Pricing from './pages/Pricing.jsx';
import Promise from './pages/Promise.jsx';
import Changelog from './pages/Changelog.jsx';
import LeaderboardPage from './pages/practice/leaderboard.jsx';
import Community from './pages/Community.jsx';
import Refer from './pages/Refer.jsx';
import FloatingMessage from './pages/components/FloatingMessage.jsx';
import StudyPlans from './pages/practice/StudyPlans.jsx';
import PairCodeSetup from './pages/practice/PairCodeSetup.jsx';
import PlacementSprintDetails from './pages/practice/plans/placement-sprint-30.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* Changed paths to lowercase to match your Header paths perfectly */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/home" element={<Dashboard />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/community" element={<Community />} />
        <Route path="/refer" element={<Refer />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/promise" element={<Promise />} />
        <Route path="/changelog" element={<Changelog />} />
        <Route path="/room/:roomId" element={<Room />} />
        <Route path="/practice/leaderboard" element={<LeaderboardPage />} />
        <Route path="/practice/studyplans" element={<StudyPlans />} />
        <Route path="*" element={<Home />} /> {/* Fallback route for unmatched paths */}  
        <Route path="/practice/paircode" element={<PairCodeSetup />} />
        <Route path="/practice/plans/placement-sprint-30" element={<PlacementSprintDetails />} />
      </Routes>
      <FloatingMessage />
    </Router>
  );
}

export default App;