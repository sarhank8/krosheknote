import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const ProductCard = ({ product }) => {
  const { openWhatsAppInquiry, goToProductDetail } = useShop();

  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid #F0E6E8',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxShadow: 'var(--shadow-card)',
      transition: 'var(--transition)',
      position: 'relative'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = 'var(--shadow-pink)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'var(--shadow-card)';
    }}
    >
      {/* Upper Image & Badges */}
      <div style={{ position: 'relative', width: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden', backgroundColor: 'var(--bg-secondary)' }}>
        <img
          src={product.image}
          alt={product.name}
          onClick={() => goToProductDetail(product.slug)}
          style={{
            width: '100%',
            height: '240px',
            objectFit: 'cover',
            cursor: 'pointer',
            transition: 'transform 0.4s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />

        {/* Category Badge */}
        <span style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(4px)',
          color: 'var(--primary-deep)',
          fontSize: '0.75rem',
          fontWeight: 700,
          padding: '4px 10px',
          borderRadius: 'var(--radius-pill)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
        }}>
          {product.category}
        </span>
      </div>

      {/* Content */}
      <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        {/* Title */}
        <h3
          onClick={() => goToProductDetail(product.slug)}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.25rem',
            fontWeight: 600,
            color: 'var(--primary-deep)',
            cursor: 'pointer',
            marginBottom: '6px',
            lineHeight: 1.3
          }}
        >
          {product.name}
        </h3>

        <p style={{
          fontSize: '0.84rem',
          color: 'var(--text-muted)',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          marginBottom: '16px',
          flexGrow: 1
        }}>
          {product.description}
        </p>

        {/* Price & WhatsApp Action */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #F8ECEF' }}>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-deep)' }}>
              ₹{product.price.toLocaleString('en-IN')}
            </div>
            {product.originalPrice && (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </div>
            )}
          </div>

          <button
            onClick={() => openWhatsAppInquiry(product, 1)}
            style={{
              backgroundColor: '#8C3149',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 'var(--radius-pill)',
              padding: '8px 16px',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(140, 49, 73, 0.2)',
              transition: 'var(--transition)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#74263B';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#8C3149';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <MessageCircle size={16} fill="#FFFFFF" />
            <span>Inquire</span>
          </button>
        </div>
      </div>
    </div>
  );
};
