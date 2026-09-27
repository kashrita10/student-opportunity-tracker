import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { MapPin, Calendar, Clock, Bookmark, BookmarkCheck, ExternalLink, ArrowLeft } from 'lucide-react';

const OpportunityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [application, setApplication] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [oppRes, bookRes, appRes] = await Promise.all([
          api.get(`/opportunities/${id}`),
          user?.role === 'student' ? api.get('/bookmarks') : Promise.resolve({data:{data:[]}}),
          user?.role === 'student' ? api.get('/applications') : Promise.resolve({data:{data:[]}})
        ]);
        
        if (oppRes.data.success) {
          setOpportunity(oppRes.data.data);
        }
        
        if (user?.role === 'student') {
          const bookmarked = bookRes.data.data.some(b => b.opportunity._id === id);
          setIsBookmarked(bookmarked);
          
          const userApp = appRes.data.data.find(a => a.opportunity._id === id);
          if (userApp) {
            setApplication(userApp);
          }
        }
      } catch (err) {
        setError('Failed to load opportunity details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, user]);

  const toggleBookmark = async () => {
    if (!user) return navigate('/login');
    if (user.role === 'admin') return;
    
    setActionLoading(true);
    try {
      if (isBookmarked) {
        await api.delete(`/bookmarks/${id}`);
        setIsBookmarked(false);
      } else {
        await api.post(`/bookmarks/${id}`);
        setIsBookmarked(true);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update bookmark');
    } finally {
      setActionLoading(false);
    }
  };

  const updateApplicationStatus = async (status) => {
    if (!user) return navigate('/login');
    if (user.role === 'admin') return;

    setActionLoading(true);
    try {
      if (application) {
        const res = await api.put(`/applications/${id}`, { status });
        setApplication(res.data.data);
      } else {
        const res = await api.post(`/applications/${id}`, { status });
        setApplication(res.data.data);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update application status');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center py-12"><div className="spinner"></div></div>;
  if (error || !opportunity) return <div className="error-message">{error || 'Opportunity not found'}</div>;

  const isExpired = new Date(opportunity.deadline) < new Date();

  return (
    <div className="animate-fade-in">
      <button onClick={() => navigate(-1)} className="btn mb-6" style={{ background: 'transparent', color: 'var(--text-secondary)', padding: 0 }}>
        <ArrowLeft size={20} /> Back to opportunities
      </button>

      <div className="card mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex gap-2 mb-2">
              <span className="badge badge-primary">{opportunity.type}</span>
              <span className="badge badge-info">{opportunity.mode}</span>
              {isExpired && <span className="badge badge-danger">Expired</span>}
            </div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{opportunity.title}</h1>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', fontWeight: '500' }}>{opportunity.organization}</h2>
          </div>
          
          {user?.role === 'student' && (
            <button 
              onClick={toggleBookmark} 
              disabled={actionLoading}
              className={`btn ${isBookmarked ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-full)' }}
            >
              {isBookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
              {isBookmarked ? 'Saved' : 'Save'}
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8 border-t border-b py-6" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-3">
            <div style={{ backgroundColor: '#f1f5f9', padding: '0.75rem', borderRadius: '50%', color: 'var(--text-primary)' }}>
              <MapPin size={24} />
            </div>
            <div>
              <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Location</p>
              <p style={{ fontWeight: '500' }}>{opportunity.location || 'Not specified'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div style={{ backgroundColor: '#f1f5f9', padding: '0.75rem', borderRadius: '50%', color: 'var(--text-primary)' }}>
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Start Date</p>
              <p style={{ fontWeight: '500' }}>{opportunity.startDate ? new Date(opportunity.startDate).toLocaleDateString() : 'ASAP'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div style={{ backgroundColor: isExpired ? '#fee2e2' : '#f1f5f9', padding: '0.75rem', borderRadius: '50%', color: isExpired ? 'var(--danger-color)' : 'var(--text-primary)' }}>
              <Clock size={24} />
            </div>
            <div>
              <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Deadline</p>
              <p style={{ fontWeight: '500', color: isExpired ? 'var(--danger-color)' : 'inherit' }}>{new Date(opportunity.deadline).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h3 className="mb-4" style={{ fontSize: '1.25rem' }}>About the Opportunity</h3>
            <div style={{ color: 'var(--text-secondary)', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
              {opportunity.description}
            </div>

            <h3 className="mt-8 mb-4" style={{ fontSize: '1.25rem' }}>Eligibility</h3>
            <p style={{ color: 'var(--text-secondary)' }}>{opportunity.eligibility || 'Open to all'}</p>

            {opportunity.stipend && (
              <>
                <h3 className="mt-8 mb-4" style={{ fontSize: '1.25rem' }}>Stipend / Prize</h3>
                <p style={{ color: 'var(--text-secondary)' }}>{opportunity.stipend}</p>
              </>
            )}
          </div>
          
          <div>
            <div className="card" style={{ backgroundColor: '#f8fafc', boxShadow: 'none' }}>
              <h4 className="mb-4">Required Skills</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
                {opportunity.skills && opportunity.skills.length > 0 ? opportunity.skills.map((skill, index) => (
                  <span key={index} className="badge" style={{ backgroundColor: 'white', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
                    {skill}
                  </span>
                )) : <span className="text-secondary">No specific skills listed</span>}
              </div>

              {user?.role === 'student' && (
                <>
                  <h4 className="mb-4 border-t pt-4" style={{ borderColor: 'var(--border-color)' }}>Application Status</h4>
                  <select 
                    className="form-control mb-4"
                    value={application?.status || ''}
                    onChange={(e) => updateApplicationStatus(e.target.value)}
                    disabled={actionLoading}
                  >
                    <option value="" disabled>Track your progress...</option>
                    <option value="Interested">Interested</option>
                    <option value="Applied">Applied</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Completed">Completed</option>
                  </select>

                  <a 
                    href={opportunity.applicationUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`btn w-full justify-center ${isExpired ? 'btn-secondary' : 'btn-primary'}`}
                    style={{ pointerEvents: isExpired ? 'none' : 'auto', opacity: isExpired ? 0.6 : 1 }}
                    onClick={(e) => {
                      if(!isExpired && (!application || application.status === 'Interested')) {
                        updateApplicationStatus('Applied');
                      }
                    }}
                  >
                    {isExpired ? 'Applications Closed' : 'Apply Now'} <ExternalLink size={18} />
                  </a>
                  {isExpired && <p className="text-center text-secondary text-sm mt-2">The deadline for this opportunity has passed.</p>}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetails;
