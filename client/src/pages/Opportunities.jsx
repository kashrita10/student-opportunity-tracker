import React, { useState, useEffect } from 'react';
import api from '../services/api';
import OpportunityCard from '../components/OpportunityCard';
import { Search, Filter } from 'lucide-react';

const Opportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    mode: '',
    deadline: '',
    page: 1
  });
  const [totalPages, setTotalPages] = useState(1);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(
        Object.entries(filters).filter(([_, v]) => v !== '')
      ).toString();
      
      const res = await api.get(`/opportunities?${queryParams}`);
      if (res.data.success) {
        setOpportunities(res.data.data);
        setTotalPages(res.data.pages || 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [filters.page, filters.type, filters.mode, filters.deadline]); // Don't auto-fetch on every search keystroke to save API calls

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, page: 1 }));
    fetchOpportunities();
  };

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value, page: 1 }));
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 style={{ fontSize: '2rem' }}>Discover Opportunities</h1>
      </div>

      <div className="card mb-8">
        <form onSubmit={handleSearchSubmit} className="grid md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <Search size={18} />
              </div>
              <input 
                type="text" 
                name="search"
                className="form-control" 
                placeholder="Search by title, organization or skills..." 
                style={{ paddingLeft: '2.5rem' }}
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
          </div>
          
          <div>
            <select name="type" className="form-control" value={filters.type} onChange={handleFilterChange}>
              <option value="">All Types</option>
              <option value="Internship">Internship</option>
              <option value="Workshop">Workshop</option>
              <option value="Hackathon">Hackathon</option>
              <option value="Certification">Certification</option>
              <option value="Competition">Competition</option>
            </select>
          </div>

          <div>
            <select name="mode" className="form-control" value={filters.mode} onChange={handleFilterChange}>
              <option value="">All Modes</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="spinner"></div>
        </div>
      ) : opportunities.length === 0 ? (
        <div className="card text-center py-12">
          <h3 className="mb-2">No opportunities found</h3>
          <p className="text-secondary">Try adjusting your filters or search terms.</p>
          <button className="btn btn-secondary mt-4" onClick={() => setFilters({search:'', type:'', mode:'', deadline:'', page:1})}>
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map(opp => (
              <OpportunityCard key={opp._id} opportunity={opp} />
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button 
                className="btn btn-secondary" 
                disabled={filters.page === 1}
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
              >
                Previous
              </button>
              <span className="flex items-center px-4" style={{ backgroundColor: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                Page {filters.page} of {totalPages}
              </span>
              <button 
                className="btn btn-secondary" 
                disabled={filters.page === totalPages}
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Opportunities;
