import React, { useContext, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Briefcase, 
  Bookmark, 
  CheckSquare, 
  User, 
  LogOut, 
  Menu,
  Settings,
  PlusCircle
} from 'lucide-react';

const MainLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const studentLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Opportunities', path: '/opportunities', icon: <Briefcase size={20} /> },
    { name: 'Bookmarks', path: '/bookmarks', icon: <Bookmark size={20} /> },
    { name: 'My Applications', path: '/applications', icon: <CheckSquare size={20} /> },
    { name: 'Profile', path: '/profile', icon: <User size={20} /> },
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Manage Opportunities', path: '/admin/opportunities', icon: <Settings size={20} /> },
    { name: 'Add Opportunity', path: '/admin/opportunities/new', icon: <PlusCircle size={20} /> },
  ];

  const navLinks = user?.role === 'admin' ? adminLinks : studentLinks;

  return (
    <div className="app-layout">
      {/* Mobile toggle */}
      <button 
        className="btn btn-secondary" 
        style={{ position: 'fixed', top: '1rem', left: '1rem', zIndex: 50, display: window.innerWidth > 768 ? 'none' : 'block' }}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu />
      </button>

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <Briefcase color="var(--primary-color)" />
          <span>OppTracker</span>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
          
          <div style={{ marginTop: 'auto' }}>
            <button 
              onClick={handleLogout} 
              className="nav-link" 
              style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', color: 'var(--danger-color)' }}
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>
      
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
