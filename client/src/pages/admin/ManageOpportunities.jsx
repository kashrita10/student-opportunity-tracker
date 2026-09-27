import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Edit, Trash2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const ManageOpportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOpportunities = async () => {
    try {
      const res = await api.get('/admin/opportunities');
      if (res.data.success) {
        setOpportunities(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        const res = await api.delete(`/opportunities/${id}`);
        if (res.data.success) {
          setOpportunities(opportunities.filter(o => o._id !== id));
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete');
      }
    }
  };

  if (loading) return <div className="flex justify-center items-center py-12"><div className="spinner"></div></div>;

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 style={{ fontSize: '2rem' }}>Manage Opportunities</h1>
        <Link to="/admin/opportunities/new" className="btn btn-primary">Add New</Link>
      </div>

      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: '#f8fafc' }}>
              <th style={{ padding: '1rem', fontWeight: '500' }}>Title</th>
              <th style={{ padding: '1rem', fontWeight: '500' }}>Organization</th>
              <th style={{ padding: '1rem', fontWeight: '500' }}>Type</th>
              <th style={{ padding: '1rem', fontWeight: '500' }}>Deadline</th>
              <th style={{ padding: '1rem', fontWeight: '500', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {opportunities.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No opportunities found.
                </td>
              </tr>
            ) : (
              opportunities.map(opp => {
                const isExpired = new Date(opp.deadline) < new Date();
                return (
                  <tr key={opp._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem' }}>
                      <Link to={`/opportunities/${opp._id}`} style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        {opp.title} <ExternalLink size={14} />
                      </Link>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{opp.organization}</td>
                    <td style={{ padding: '1rem' }}>
                      <span className="badge badge-info">{opp.type}</span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ color: isExpired ? 'var(--danger-color)' : 'inherit' }}>
                        {new Date(opp.deadline).toLocaleDateString()}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/opportunities/edit/${opp._id}`} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }}>
                          <Edit size={16} /> Edit
                        </Link>
                        <button 
                          onClick={() => handleDelete(opp._id, opp.title)} 
                          className="btn btn-danger" 
                          style={{ padding: '0.25rem 0.5rem' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageOpportunities;
