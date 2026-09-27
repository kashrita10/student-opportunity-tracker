import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    college: '',
    course: '',
    graduationYear: '',
    skills: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/me');
        if (res.data.success) {
          const data = res.data.data;
          setFormData({
            name: data.name || '',
            college: data.college || '',
            course: data.course || '',
            graduationYear: data.graduationYear || '',
            skills: data.skills ? data.skills.join(', ') : ''
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      const submitData = {
        ...formData,
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : []
      };
      
      const res = await api.put('/auth/me', submitData);
      if (res.data.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center py-12"><div className="spinner"></div></div>;

  return (
    <div className="animate-fade-in max-w-2xl mx-auto" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>My Profile</h1>

      <div className="card">
        {message.text && (
          <div className="mb-4" style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: message.type === 'success' ? '#d1fae5' : '#fee2e2', color: message.type === 'success' ? '#047857' : '#b91c1c' }}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label className="form-label">Email Address (Read-only)</label>
            <input type="email" className="form-control" value={user?.email || ''} disabled style={{ backgroundColor: '#f1f5f9' }} />
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="form-group mb-0">
              <label className="form-label">College/University</label>
              <input type="text" name="college" className="form-control" value={formData.college} onChange={handleChange} />
            </div>
            <div className="form-group mb-0">
              <label className="form-label">Course / Degree</label>
              <input type="text" name="course" className="form-control" value={formData.course} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Graduation Year</label>
            <input type="number" name="graduationYear" className="form-control" value={formData.graduationYear} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="form-label">Skills (comma separated)</label>
            <input type="text" name="skills" className="form-control" value={formData.skills} onChange={handleChange} placeholder="e.g. React, Python, UI/UX" />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Used for personalized recommendations (coming soon)</p>
          </div>

          <button type="submit" className="btn btn-primary mt-4" disabled={saving}>
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
