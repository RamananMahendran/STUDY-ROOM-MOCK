import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Rooms from './pages/Rooms.jsx';
import Profile from './pages/Profile.jsx';
import Room from './pages/Room.jsx';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Pricing from './pages/Pricing.jsx';
import Promise from './pages/Promise.jsx';
import Changelog from './pages/Changelog.jsx';
import LeaderboardPage from './pages/practice/leaderboard.jsx';
import MockInterview from './pages/practice/MockInterview.jsx';
import Playground from './pages/practice/Playground.jsx';
import ProblemsPage from './pages/practice/ProblemsPage.jsx';
import ProblemPage from './pages/practice/ProblemPage.jsx';
import Community from './pages/community.jsx';
import ReferAndEarn from './pages/ReferAndEarn.jsx';
import FloatingMessage from './pages/components/FloatingMessage.jsx';
import StudyPlans from './pages/practice/StudyPlans.jsx';
import PairCodeSetup from './pages/practice/PairCodeSetup.jsx';
import PairCode from './pages/practice/PairCode.jsx';
import Contests from './pages/Contests.jsx';
import ContestArena from './pages/ContestArena.jsx';
import ContestEditor from './pages/ContestEditor.jsx';
import AppLayout from './pages/components/AppLayout.jsx';
import PlacementSprint30 from './pages/practice/plans/placement-sprint-30.jsx';
import FaangPrep45 from './pages/practice/plans/faang-prep-45.jsx';
import ArraysMastery14 from './pages/practice/plans/arrays-mastery-14.jsx';
import WeeklyChallenge7 from './pages/practice/plans/weekly-challenge-7.jsx';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminUsers from './pages/admin/AdminUsers.jsx';
import AdminProblems from './pages/admin/AdminProblems.jsx';
import AdminContests from './pages/admin/AdminContests.jsx';
import AdminRooms from './pages/admin/AdminRooms.jsx';
import AdminSubmissions from './pages/admin/AdminSubmissions.jsx';
import AdminStudyPlans from './pages/admin/AdminStudyPlans.jsx';
import AdminAuditLog from './pages/admin/AdminAuditLog.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* Changed paths to lowercase to match your Header paths perfectly */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        {/* Authenticated routes inside common layout */}
        <Route element={<AppLayout />}>
          <Route path="/home" element={<Dashboard />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/community" element={<Community />} />
          <Route path="/refer" element={<ReferAndEarn />} />
          <Route path="/practice/leaderboard" element={<LeaderboardPage />} />
          <Route path="/practice/mock-interview" element={<MockInterview />} />
          <Route path="/practice/problems" element={<ProblemsPage />} />
          <Route path="/practice/problems/:slug" element={<ProblemPage />} />
          <Route path="/practice/playground" element={<Playground />} />
          <Route path="/practice/study-plans" element={<StudyPlans />} />
          <Route path="/practice/study-plans/placement-sprint-30" element={<PlacementSprint30 />} />
          <Route path="/practice/study-plans/faang-prep-45" element={<FaangPrep45 />} />
          <Route path="/practice/study-plans/arrays-mastery-14" element={<ArraysMastery14 />} />
          <Route path="/practice/study-plans/weekly-challenge-7" element={<WeeklyChallenge7 />} />
          <Route path="/practice/pair-code" element={<PairCodeSetup />} />
          <Route path="/practice/pair/:roomId" element={<PairCode />} />
          <Route path="/contests" element={<Contests />} />
          <Route path="/contests/:id" element={<ContestArena />} />
          <Route path="/contests/:id/problem/:problemId" element={<ContestEditor />} />
        </Route>
        
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/promise" element={<Promise />} />
        <Route path="/changelog" element={<Changelog />} />
        <Route path="/room/:roomId" element={<Room />} />

        {/* Admin Panel */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/problems" element={<AdminProblems />} />
          <Route path="/admin/contests" element={<AdminContests />} />
          <Route path="/admin/rooms" element={<AdminRooms />} />
          <Route path="/admin/submissions" element={<AdminSubmissions />} />
          <Route path="/admin/study-plans" element={<AdminStudyPlans />} />
          <Route path="/admin/audit-log" element={<AdminAuditLog />} />
        </Route>

        <Route path="*" element={<Home />} /> {/* Fallback route for unmatched paths */}  
      </Routes>
      <FloatingMessage />
    </Router>
  );
}

export default App;