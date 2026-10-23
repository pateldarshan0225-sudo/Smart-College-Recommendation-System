import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout.jsx';
import UserLayout from './layouts/UserLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import AdminRoute from './routes/AdminRoute.jsx';
import Loader from './components/Loader.jsx';
const Home = lazy(() => import('./pages/public/Home.jsx'));
const Login = lazy(() => import('./pages/public/Login.jsx'));
const Register = lazy(() => import('./pages/public/Register.jsx'));
const AdminLogin = lazy(() => import('./pages/public/AdminLogin.jsx'));
const CollegeList = lazy(() => import('./pages/public/CollegeList.jsx'));
const CollegeDetails = lazy(() => import('./pages/user/CollegeDetails.jsx'));
const UserDashboard = lazy(() => import('./pages/user/Dashboard.jsx'));
const Profile = lazy(() => import('./pages/user/Profile.jsx'));
const Recommendations = lazy(() => import('./pages/user/Recommendations.jsx'));
const Shortlist = lazy(() => import('./pages/user/Shortlist.jsx'));
const Feedback = lazy(() => import('./pages/user/Feedback.jsx'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard.jsx'));
const Streams = lazy(() => import('./pages/admin/Streams.jsx'));
const Courses = lazy(() => import('./pages/admin/Courses.jsx'));
const EntranceExams = lazy(() => import('./pages/admin/EntranceExams.jsx'));
const Colleges = lazy(() => import('./pages/admin/Colleges.jsx'));
const CollegeCourses = lazy(() => import('./pages/admin/CollegeCourses.jsx'));
const Users = lazy(() => import('./pages/admin/Users.jsx'));
const Feedbacks = lazy(() => import('./pages/admin/Feedbacks.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));
export default function App() {
  return <Suspense fallback={<Loader />}>
  <Routes>
    <Route element={<PublicLayout />}>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="admin/login" element={<AdminLogin />} />
      <Route path="colleges" element={<CollegeList />} />
      <Route path="colleges/:id" element={<CollegeDetails />} />
      <Route path="*" element={<NotFound />} />
    </Route>
    <Route element={<ProtectedRoute />}>
      <Route path="user" element={<UserLayout />}>
        <Route index element={<UserDashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="recommendations" element={<Recommendations />} />
        <Route path="shortlist" element={<Shortlist />} />
        <Route path="feedback" element={<Feedback />} />
      </Route>
    </Route>
    <Route element={<AdminRoute />}>
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="streams" element={<Streams />} />
        <Route path="courses" element={<Courses />} />
        <Route path="entrance-exams" element={<EntranceExams />} />
        <Route path="colleges" element={<Colleges />} />
        <Route path="college-courses" element={<CollegeCourses />} />
        <Route path="users" element={<Users />} />
        <Route path="feedbacks" element={<Feedbacks />} />
      </Route>
    </Route>
  </Routes>
</Suspense>;
}
