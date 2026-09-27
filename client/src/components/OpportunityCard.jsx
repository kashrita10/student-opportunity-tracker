import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Clock, ArrowRight } from 'lucide-react';

const OpportunityCard = ({ opportunity }) => {
  const { _id, title, organization, type, mode, deadline, skills } = opportunity;
  
  const isExpired = new Date(deadline) < new Date();
  
  const getBadgeClass = (type) => {
    switch (type) {
      case 'Internship': return 'badge-primary';
      case 'Hackathon': return 'badge-warning';
      case 'Workshop': return 'badge-info';
      default: return 'badge-success';
    }
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="flex justify-between items-center mb-4">
        <span className={`badge ${getBadgeClass(type)}`}>{type}</span>
        <span className={`badge ${isExpired ? 'badge-danger' : 'badge-info'}`} style={{ backgroundColor: isExpired ? '' : '#f1f5f9', color: isExpired ? '' : 'var(--text-secondary)' }}>
          {mode}
        </span>
      </div>
      
      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', fontWeight: '500', marginBottom: '1rem' }}>{organization}</p>
      
      <div style={{ marginTop: 'auto' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
          {skills && skills.slice(0, 3).map((skill, index) => (
            <span key={index} style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', backgroundColor: '#f1f5f9', borderRadius: '4px', color: 'var(--text-secondary)' }}>
              {skill}
            </span>
          ))}
          {skills && skills.length > 3 && <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', color: 'var(--text-muted)' }}>+{skills.length - 3} more</span>}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isExpired ? 'var(--danger-color)' : 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          <Calendar size={16} />
          <span>Deadline: {new Date(deadline).toLocaleDateString()}</span>
          {isExpired && <span style={{ fontWeight: '600' }}>(Expired)</span>}
        </div>
        
        <Link to={`/opportunities/${_id}`} className="btn btn-secondary w-full justify-center">
          View Details <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default OpportunityCard;
