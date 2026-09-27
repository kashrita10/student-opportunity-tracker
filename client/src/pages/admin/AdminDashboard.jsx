import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, Briefcase, CheckSquare, BarChart } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex justify-center items-center py-12"><div className="spinner"></div></div>;
  if (!stats) return <div className="error-message">Failed to load admin stats</div>;

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 style={{ fontSize: '2rem' }}>Admin Dashboard</h1>
        <Link to="/admin/opportunities/new" className="btn btn-primary">Add Opportunity</Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: '#e0e7ff', padding: '1.25rem', borderRadius: 'var(--radius-lg)', color: '#4338ca' }}>
            <Briefcase size={28} />
          </div>
          <div>
            <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Total Opportunities</p>
            <h3 style={{ fontSize: '1.75rem' }}>{stats.totalOpportunities}</h3>
          </div>
        </div>
        
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: '#d1fae5', padding: '1.25rem', borderRadius: 'var(--radius-lg)', color: '#047857' }}>
            <Users size={28} />
          </div>
          <div>
            <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Total Students</p>
            <h3 style={{ fontSize: '1.75rem' }}>{stats.totalStudents}</h3>
          </div>
        </div>
        
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: '#fef3c7', padding: '1.25rem', borderRadius: 'var(--radius-lg)', color: '#b45309' }}>
            <CheckSquare size={28} />
          </div>
          <div>
            <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Total Applications</p>
            <h3 style={{ fontSize: '1.75rem' }}>{stats.totalApplications}</h3>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center gap-2 mb-6 border-b pb-4" style={{ borderColor: 'var(--border-color)' }}>
          <BarChart color="var(--primary-color)" />
          <h2 style={{ fontSize: '1.25rem' }}>Opportunities by Type</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          {Object.entries(stats.opportunitiesByType).map(([type, count]) => (
            <div key={type} style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: '500' }}>{type}</h4>
              <p style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--primary-color)' }}>{count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
