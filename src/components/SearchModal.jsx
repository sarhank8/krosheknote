import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const SearchModal = ({ isOpen, onClose }) => {
  const { goToProductDetail } = useShop();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      fetch(`/api/products?search=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setResults(data.products);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '600px',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-pink)',
          boxShadow: '0 20px 40px rgba(140, 49, 73, 0.2)',
          padding: '24px',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          animation: 'fadeIn 0.25s ease-out'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="var(--primary)" />
            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary-deep)', fontSize: '1.25rem' }}>
              Search krosheknote
            </h3>
          </div>
          <button onClick={onClose} style={{ padding: '6px', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Search Input */}
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-pill)',
          padding: '4px 16px',
          border: '1px solid var(--border-pink)'
        }}>
          <Search size={18} color="var(--primary-dark)" />
          <input
            type="text"
            placeholder="Search plushies, cardigans, bags, booties..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            style={{
              width: '100%',
              padding: '12px 12px',
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '0.95rem',
              color: 'var(--text-dark)'
            }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ color: 'var(--text-light)' }}>
              <X size={16} />
            </button>
          )}
        </div>

        {/* Results Container */}
        <div style={{ marginTop: '20px', overflowY: 'auto', flexGrow: 1, paddingRight: '4px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
              Searching soft handcrafted creations...
            </div>
          ) : results.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {results.map(item => (
                <div
                  key={item.id}
                  onClick={() => {
                    goToProductDetail(item.slug);
                    onClose();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-main)',
                    border: '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-pink)';
                    e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.backgroundColor = 'var(--bg-main)';
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '54px', height: '54px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                  />
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ fontWeight: 600, color: 'var(--primary-deep)', fontSize: '0.95rem' }}>{item.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.category} • ₹{item.price}</div>
                  </div>
                  <ArrowRight size={16} color="var(--primary)" />
                </div>
              ))}
            </div>
          ) : query ? (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
              No crochet creations found for "{query}". Try searching "bunny", "cardigan", or "bag"!
            </div>
          ) : (
            <div style={{ padding: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <div style={{ fontWeight: 600, color: 'var(--primary-deep)', marginBottom: '8px' }}>Popular Searches:</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['Bonbon Bunny', 'Granny Cardigan', 'Market Bag', 'Heart Coasters', 'Little Booties'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--primary-deep)',
                      fontSize: '0.8rem',
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-pill)',
                      border: '1px solid var(--border-pink)'
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
