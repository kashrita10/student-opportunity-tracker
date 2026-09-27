import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const OpportunityForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    description: '',
    type: 'Internship',
    mode: 'Online',
    location: '',
    applicationUrl: '',
    deadline: '',
    startDate: '',
    stipend: '',
    category: '',
    skills: ''
  });
  
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      const fetchOpportunity = async () => {
        try {
          const res = await api.get(`/opportunities/${id}`);
          if (res.data.success) {
            const data = res.data.data;
            setFormData({
              title: data.title || '',
              organization: data.organization || '',
              description: data.description || '',
              type: data.type || 'Internship',
              mode: data.mode || 'Online',
              location: data.location || '',
              applicationUrl: data.applicationUrl || '',
              deadline: data.deadline ? new Date(data.deadline).toISOString().split('T')[0] : '',
              startDate: data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : '',
              stipend: data.stipend || '',
              category: data.category || '',
              skills: data.skills ? data.skills.join(', ') : ''
            });
          }
        } catch (err) {
          setError('Failed to load opportunity data');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchOpportunity();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : []
      };

      if (isEdit) {
        await api.put(`/opportunities/${id}`, submitData);
      } else {
        await api.post('/opportunities', submitData);
      }
      
      navigate('/admin/opportunities');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save opportunity');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center py-12"><div className="spinner"></div></div>;

  return (
    <div className="animate-fade-in max-w-2xl mx-auto" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="flex justify-between items-center mb-6">
        <h1 style={{ fontSize: '2rem' }}>{isEdit ? 'Edit Opportunity' : 'Add Opportunity'}</h1>
        <button onClick={() => navigate('/admin/opportunities')} className="btn btn-secondary">Cancel</button>
      </div>

      <div className="card">
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="form-group mb-0">
              <label className="form-label">Title *</label>
              <input type="text" name="title" className="form-control" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="form-group mb-0">
              <label className="form-label">Organization *</label>
              <input type="text" name="organization" className="form-control" value={formData.organization} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea name="description" className="form-control" rows="5" value={formData.description} onChange={handleChange} required></textarea>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="form-group mb-0">
              <label className="form-label">Type *</label>
              <select name="type" className="form-control" value={formData.type} onChange={handleChange} required>
                <option value="Internship">Internship</option>
                <option value="Workshop">Workshop</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Certification">Certification</option>
                <option value="Competition">Competition</option>
              </select>
            </div>
            <div className="form-group mb-0">
              <label className="form-label">Mode *</label>
              <select name="mode" className="form-control" value={formData.mode} onChange={handleChange} required>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="form-group mb-0">
              <label className="form-label">Location</label>
              <input type="text" name="location" className="form-control" value={formData.location} onChange={handleChange} placeholder="e.g. New York, NY" />
            </div>
            <div className="form-group mb-0">
              <label className="form-label">Category</label>
              <input type="text" name="category" className="form-control" value={formData.category} onChange={handleChange} placeholder="e.g. Technology" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="form-group mb-0">
              <label className="form-label">Application URL *</label>
              <input type="url" name="applicationUrl" className="form-control" value={formData.applicationUrl} onChange={handleChange} required placeholder="https://..." />
            </div>
            <div className="form-group mb-0">
              <label className="form-label">Stipend / Prize</label>
              <input type="text" name="stipend" className="form-control" value={formData.stipend} onChange={handleChange} placeholder="e.g. $1000/month" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="form-group mb-0">
              <label className="form-label">Deadline *</label>
              <input type="date" name="deadline" className="form-control" value={formData.deadline} onChange={handleChange} required />
            </div>
            <div className="form-group mb-0">
              <label className="form-label">Start Date</label>
              <input type="date" name="startDate" className="form-control" value={formData.startDate} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Skills required (comma separated)</label>
            <input type="text" name="skills" className="form-control" value={formData.skills} onChange={handleChange} placeholder="e.g. React, Node.js, Python" />
          </div>

          <button type="submit" className="btn btn-primary mt-4 w-full justify-center" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Update Opportunity' : 'Create Opportunity'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OpportunityForm;
