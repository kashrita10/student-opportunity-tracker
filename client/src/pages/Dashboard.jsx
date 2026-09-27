import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import OpportunityCard from '../components/OpportunityCard';
import { Bookmark, CheckSquare, Clock, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard/student');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center" style={{ minHeight: '50vh' }}><div className="spinner"></div></div>;
  }

  if (!stats) return <div>Failed to load dashboard.</div>;

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 style={{ fontSize: '2rem' }}>Welcome back, {user?.name.split(' ')[0]}!</h1>
          <p className="text-secondary mt-1">Here's what's happening with your applications today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: '#e0f2fe', padding: '1rem', borderRadius: 'var(--radius-lg)', color: '#0369a1' }}>
            <Bookmark size={24} />
          </div>
          <div>
            <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Saved</p>
            <h3 style={{ fontSize: '1.5rem' }}>{stats.totalBookmarks}</h3>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: '#fef3c7', padding: '1rem', borderRadius: 'var(--radius-lg)', color: '#b45309' }}>
            <Clock size={24} />
          </div>
          <div>
            <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Applied</p>
            <h3 style={{ fontSize: '1.5rem' }}>{stats.applicationsByStatus.Applied}</h3>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: '#d1fae5', padding: '1rem', borderRadius: 'var(--radius-lg)', color: '#047857' }}>
            <CheckSquare size={24} />
          </div>
          <div>
            <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Shortlisted</p>
            <h3 style={{ fontSize: '1.5rem' }}>{stats.applicationsByStatus.Shortlisted}</h3>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: '#f3f4f6', padding: '1rem', borderRadius: 'var(--radius-lg)', color: '#374151' }}>
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Completed</p>
            <h3 style={{ fontSize: '1.5rem' }}>{stats.applicationsByStatus.Completed}</h3>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Upcoming Deadlines */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 style={{ fontSize: '1.25rem' }}>Upcoming Deadlines</h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {stats.upcomingDeadlines.length === 0 ? (
              <div className="card text-center text-secondary py-8">
                No upcoming deadlines for your saved opportunities.
              </div>
            ) : (
              stats.upcomingDeadlines.map(opp => (
                <Link to={`/opportunities/${opp._id}`} key={opp._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', textDecoration: 'none' }}>
                  <div>
                    <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{opp.title}</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{opp.organization}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-warning" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={12} /> {new Date(opp.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recently Added */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 style={{ fontSize: '1.25rem' }}>Recently Added</h2>
            <Link to="/opportunities" style={{ fontSize: '0.875rem' }}>View all</Link>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {stats.recentlyAdded.length === 0 ? (
              <div className="card text-center text-secondary py-8">
                No new opportunities available.
              </div>
            ) : (
              stats.recentlyAdded.map(opp => (
                <Link to={`/opportunities/${opp._id}`} key={opp._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', textDecoration: 'none' }}>
                  <div>
                    <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{opp.title}</h4>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span className="badge badge-info">{opp.type}</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
