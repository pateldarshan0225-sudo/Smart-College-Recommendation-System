import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/user/Dashboard';
import Profile from './pages/user/Profile';
import Academic from './pages/user/Academic';
import Preferences from './pages/user/Preferences';
import Recommendations from './pages/user/Recommendations';
import CollegeDetails from './pages/user/CollegeDetails';
import Saved from './pages/user/Saved';
import Compare from './pages/user/Compare';
import AdminDashboard from './pages/admin/Dashboard';
import EntityPage from './pages/admin/EntityPage';
import RuangEditLanding from './pages/RuangEditLanding';

// Dedicated Standalone Public Pages
import CollegeLanding from './pages/CollegeLanding';
import CollegesPage from './pages/CollegesPage';
import AiMatcherPage from './pages/AiMatcherPage';
import RoadmapPage from './pages/RoadmapPage';
import CareersPage from './pages/CareersPage';
import ScholarshipsPage from './pages/ScholarshipsPage';
import ComparePage from './pages/ComparePage';

const entities = [
  'users',
  'student_profiles',
  'academic_records',
  'colleges',
  'courses',
  'college_courses',
  'college_placements',
  'college_fees',
  'campus_facilities',
  'saved_colleges',
  'recommendations'
];

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            {/* Dedicated Public Pages */}
            <Route path="/" element={<CollegeLanding />} />
            <Route path="/colleges" element={<CollegesPage />} />
            <Route path="/ai-matcher" element={<AiMatcherPage />} />
            <Route path="/engine" element={<AiMatcherPage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/scholarships" element={<ScholarshipsPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/ruang-edit" element={<RuangEditLanding />} />

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* User Protected Routes */}
            <Route element={<ProtectedRoute role="user" />}>
              <Route path="/user" element={<UserLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="profile" element={<Profile />} />
                <Route path="academic" element={<Academic />} />
                <Route path="preferences" element={<Preferences />} />
                <Route path="recommendations" element={<Recommendations />} />
                <Route path="colleges/:id" element={<CollegeDetails />} />
                <Route path="saved" element={<Saved />} />
                <Route path="compare" element={<Compare />} />
              </Route>
            </Route>

            {/* Admin Protected Routes */}
            <Route element={<ProtectedRoute role="admin" />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                {entities.map((e) => (
                  <Route key={e} path={e} element={<EntityPage entity={e} />} />
                ))}
              </Route>
            </Route>

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}
