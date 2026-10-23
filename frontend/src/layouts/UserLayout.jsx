import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import Sidebar from '../components/Sidebar.jsx';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
export default function UserLayout() {
  return <>
  <a href="#main" className="skip-link">Skip to content</a>
  <Navbar />
  <div className="workspace">
    <Sidebar role="user" />
    <main id="main" className="workspace-content">
      <Breadcrumbs />
      <Outlet />
    </main>
  </div>
  <Footer />
</>;
}
