import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ 
    name: '', email: '', password: '', college: '', course: '', graduationYear: '' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await register(formData);
      if (res.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-center mb-4">Create an Account</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
        </div>
        
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
        </div>
        
        <div className="form-group">
          <label className="form-label">Password</label>
          <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required minLength="6" />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="form-group mb-0">
            <label className="form-label">College/University</label>
            <input type="text" name="college" className="form-control" value={formData.college} onChange={handleChange} />
          </div>
          <div className="form-group mb-0">
            <label className="form-label">Graduation Year</label>
            <input type="number" name="graduationYear" className="form-control" value={formData.graduationYear} onChange={handleChange} />
          </div>
        </div>
        
        <button type="submit" className="btn btn-primary w-full justify-center mt-4" disabled={loading}>
          {loading ? 'Registering...' : 'Register as Student'}
        </button>
      </form>
      
      <p className="text-center mt-4" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Register;
