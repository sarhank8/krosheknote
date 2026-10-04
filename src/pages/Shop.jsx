import React, { useState } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';

export const Shop = () => {
  const { products, categories, selectedCategory, setSelectedCategory, loadingCatalog } = useShop();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('default');

  // Filter products by selected category and search query
  let filteredProducts = [...products];

  if (selectedCategory && selectedCategory.toLowerCase() !== 'all') {
    filteredProducts = filteredProducts.filter(
      p => p.categorySlug.toLowerCase() === selectedCategory.toLowerCase() ||
           p.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }

  if (searchQuery.trim()) {
    const term = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(
      p => p.name.toLowerCase().includes(term) ||
           p.description.toLowerCase().includes(term)
    );
  }

  if (sortOption === 'price-low') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === 'price-high') {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <div className="container" style={{ paddingTop: '36px', paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', color: '#5C2232', fontWeight: 700, marginBottom: '8px' }}>
          Crochet Catalog
        </h1>
        <p style={{ color: '#6E5C62', fontSize: '1rem' }}>
          Handmade plushies, wearable cardigans, bags, and home decor pieces. Order directly via WhatsApp.
        </p>
      </div>

      {/* Search Bar & Filters Controls Bar */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #F0E6E8',
        padding: '20px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
        marginBottom: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* Search Input */}
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#FFF9FA',
          border: '1px solid #F4C4D0',
          borderRadius: '9999px',
          padding: '4px 18px'
        }}>
          <Search size={18} color="#8C3149" />
          <input
            type="text"
            placeholder="Search by product name, category, or detail..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '0.95rem',
              color: '#3A2E32'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ color: '#8C757C', padding: '4px' }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category Pills & Sort Dropdown */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          {/* Dynamic Category Filter Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {categories.map(cat => {
              const isActive = selectedCategory.toLowerCase() === cat.slug.toLowerCase();
              return (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategory(cat.slug)}
                  style={{
                    backgroundColor: isActive ? '#8C3149' : '#FFF0F3',
                    color: isActive ? '#FFFFFF' : '#8C3149',
                    border: '1px solid #F4C4D0',
                    borderRadius: '9999px',
                    padding: '8px 18px',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {cat.name} ({cat.count})
                </button>
              );
            })}
          </div>

          {/* Sort Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SlidersHorizontal size={15} color="#8C3149" />
            <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#6E5C62' }}>Sort:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #F4C4D0',
                borderRadius: '9999px',
                padding: '7px 14px',
                fontSize: '0.86rem',
                color: '#3A2E32',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="default">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {loadingCatalog ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#8C757C' }}>
          Loading catalog items...
        </div>
      ) : filteredProducts.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '28px'
        }}>
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: '#FFF0F3',
          borderRadius: '16px',
          border: '1px solid #F4C4D0'
        }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', color: '#5C2232', fontSize: '1.3rem', marginBottom: '8px' }}>
            No creations found
          </h3>
          <p style={{ color: '#6E5C62', fontSize: '0.9rem', marginBottom: '20px' }}>
            Try adjusting your search query or selected category filter.
          </p>
          <button
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
            className="btn-primary"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};
