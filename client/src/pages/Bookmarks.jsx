import React, { useState, useEffect } from 'react';
import api from '../services/api';
import OpportunityCard from '../components/OpportunityCard';
import { Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await api.get('/bookmarks');
        if (res.data.success) {
          setBookmarks(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  if (loading) return <div className="flex justify-center items-center py-12"><div className="spinner"></div></div>;

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 style={{ fontSize: '2rem' }}>Saved Opportunities</h1>
      </div>

      {bookmarks.length === 0 ? (
        <div className="card text-center py-12">
          <div className="flex justify-center mb-4" style={{ color: 'var(--text-muted)' }}>
            <Bookmark size={48} />
          </div>
          <h3 className="mb-2">No bookmarked opportunities yet.</h3>
          <p className="text-secondary mb-6">Save opportunities you're interested in to easily find them later.</p>
          <Link to="/opportunities" className="btn btn-primary">Browse Opportunities</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map(b => (
            <OpportunityCard key={b.opportunity._id} opportunity={b.opportunity} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
