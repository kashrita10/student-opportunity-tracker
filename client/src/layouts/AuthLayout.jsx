import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AuthLayout = () => {
  const { user } = React.useContext(AuthContext);

  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />;
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
      padding: '2rem'
    }}>
      <div className="container" style={{ maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: 'var(--primary-color)' }}>OppTracker</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Your gateway to career opportunities</p>
        </div>
        <div className="card">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
