import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import Sidebar from '../components/Sidebar.jsx';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
export default function AdminLayout() {
  return <>
  <a href="#main" className="skip-link">Skip to content</a>
  <Navbar />
  <div className="workspace">
    <Sidebar role="admin" />
    <main id="main" className="workspace-content">
      <Breadcrumbs />
      <Outlet />
    </main>
  </div>
  <Footer />
</>;
}
