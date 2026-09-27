import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Search, Star, TrendingUp } from 'lucide-react';

const Home = () => {
  return (
    <div>
      {/* Navbar */}
      <nav style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--surface-color)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--primary-color)' }}>
          <Briefcase />
          <span>OppTracker</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/login" className="btn btn-secondary">Login</Link>
          <Link to="/register" className="btn btn-primary">Register</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: '5rem 2rem', textAlign: 'center', background: 'linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%)', color: 'white' }}>
        <div className="container animate-fade-in">
          <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'white' }}>Discover Opportunities. Unlock Your Potential.</h1>
          <p style={{ fontSize: '1.25rem', marginBottom: '2rem', maxWidth: '800px', margin: '0 auto 2rem auto', opacity: 0.9 }}>
            Stop searching across a dozen platforms. Find internships, hackathons, and certifications all in one centralized student opportunity tracker.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <Link to="/register" className="btn" style={{ backgroundColor: 'white', color: 'var(--primary-color)', fontSize: '1.1rem', padding: '0.75rem 1.5rem' }}>Get Started for Free</Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container" style={{ padding: '5rem 1rem' }}>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="card text-center">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--primary-color)' }}>
              <Search size={40} />
            </div>
            <h3 className="mb-2">Smart Discovery</h3>
            <p className="text-secondary">Easily search and filter opportunities based on your skills, mode, and deadlines.</p>
          </div>
          <div className="card text-center">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--success-color)' }}>
              <Star size={40} />
            </div>
            <h3 className="mb-2">Bookmark & Save</h3>
            <p className="text-secondary">Never lose track of an interesting opportunity. Bookmark it to apply later.</p>
          </div>
          <div className="card text-center">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--warning-color)' }}>
              <TrendingUp size={40} />
            </div>
            <h3 className="mb-2">Track Applications</h3>
            <p className="text-secondary">Manage your application journey from "Interested" all the way to "Completed".</p>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer style={{ backgroundColor: 'var(--surface-color)', padding: '2rem', textAlign: 'center', borderTop: '1px solid var(--border-color)' }}>
        <p className="text-secondary">© 2026 Student Opportunity Tracker. Built for Hackathon.</p>
      </footer>
    </div>
  );
};

export default Home;
