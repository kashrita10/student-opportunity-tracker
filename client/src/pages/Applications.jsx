import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { CheckSquare, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get('/applications');
        if (res.data.success) {
          setApplications(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const updateStatus = async (appId, oppId, newStatus) => {
    try {
      const res = await api.put(`/applications/${oppId}`, { status: newStatus });
      if (res.data.success) {
        setApplications(apps => apps.map(a => a._id === appId ? { ...a, status: newStatus } : a));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Interested': return 'badge-secondary';
      case 'Applied': return 'badge-info';
      case 'Shortlisted': return 'badge-primary';
      case 'Completed': return 'badge-success';
      default: return 'badge-secondary';
    }
  };

  if (loading) return <div className="flex justify-center items-center py-12"><div className="spinner"></div></div>;

  const filteredApps = filter === 'All' ? applications : applications.filter(a => a.status === filter);

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 style={{ fontSize: '2rem' }}>My Applications</h1>
      </div>

      <div className="card mb-6" style={{ padding: '1rem' }}>
        <div className="flex gap-2" style={{ overflowX: 'auto' }}>
          {['All', 'Interested', 'Applied', 'Shortlisted', 'Completed'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-full)' }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filteredApps.length === 0 ? (
        <div className="card text-center py-12">
          <div className="flex justify-center mb-4" style={{ color: 'var(--text-muted)' }}>
            <CheckSquare size={48} />
          </div>
          <h3 className="mb-2">You haven't started tracking any applications yet.</h3>
          <p className="text-secondary mb-6">Keep track of your job search progress here.</p>
          <Link to="/opportunities" className="btn btn-primary">Find Opportunities</Link>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: '#f8fafc' }}>
                <th style={{ padding: '1rem', fontWeight: '500' }}>Opportunity</th>
                <th style={{ padding: '1rem', fontWeight: '500' }}>Organization</th>
                <th style={{ padding: '1rem', fontWeight: '500' }}>Type</th>
                <th style={{ padding: '1rem', fontWeight: '500' }}>Status</th>
                <th style={{ padding: '1rem', fontWeight: '500' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map(app => (
                <tr key={app._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>
                    <Link to={`/opportunities/${app.opportunity._id}`} style={{ fontWeight: '500' }}>
                      {app.opportunity.title}
                    </Link>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{app.opportunity.organization}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className="badge badge-info">{app.opportunity.type}</span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <select 
                      className="form-control" 
                      style={{ padding: '0.25rem 0.5rem', width: 'auto' }}
                      value={app.status}
                      onChange={(e) => updateStatus(app._id, app.opportunity._id, e.target.value)}
                    >
                      <option value="Interested">Interested</option>
                      <option value="Applied">Applied</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <a href={app.opportunity.applicationUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}>
                      <ExternalLink size={14} /> Link
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Applications;
