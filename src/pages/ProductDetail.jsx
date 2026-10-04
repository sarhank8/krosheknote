import React, { useState, useEffect } from 'react';
import { Clock, MessageCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';

export const ProductDetail = () => {
  const {
    selectedProductSlug,
    openWhatsAppInquiry,
    goToShop,
    goToHome
  } = useShop();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [customNote, setCustomNote] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedProductSlug) return;
    setLoading(true);
    setQuantity(1);
    setCustomNote('');

    fetch(`/api/products/${selectedProductSlug}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProduct(data.product);

          fetch(`/api/products?category=${data.product.categorySlug}`)
            .then(res => res.json())
            .then(catData => {
              if (catData.success) {
                setRelatedProducts(catData.products.filter(p => p.id !== data.product.id));
              }
            });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [selectedProductSlug]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading catalog item...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2>Catalog Item Not Found</h2>
        <button onClick={() => goToShop('all')} className="btn-primary" style={{ marginTop: '20px' }}>
          Back to Collection
        </button>
      </div>
    );
  }

  const totalPrice = product.price * quantity;

  return (
    <div className="container" style={{ paddingTop: '32px', paddingBottom: '80px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '28px' }}>
        <button onClick={goToHome} style={{ color: 'inherit' }}>Home</button>
        <span>/</span>
        <button onClick={() => goToShop('all')} style={{ color: 'inherit' }}>Collection</button>
        <span>/</span>
        <button onClick={() => goToShop(product.categorySlug)} style={{ color: 'inherit' }}>{product.category}</button>
        <span>/</span>
        <span style={{ color: 'var(--primary-deep)', fontWeight: 600 }}>{product.name}</span>
      </div>

      {/* Main Product Display */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '48px',
        marginBottom: '70px'
      }}>
        {/* Left Image Showcase */}
        <div>
          <div style={{
            position: 'relative',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            backgroundColor: 'var(--bg-secondary)',
            border: '1.5px solid var(--border-pink)',
            boxShadow: 'var(--shadow-card)'
          }}>
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '100%', height: '480px', objectFit: 'cover' }}
            />

            <span style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              backgroundColor: '#FFFFFF',
              color: 'var(--primary-deep)',
              fontWeight: 700,
              fontSize: '0.8rem',
              padding: '6px 14px',
              borderRadius: 'var(--radius-pill)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
            }}>
              {product.category}
            </span>
          </div>
        </div>

        {/* Right Details */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2.4rem',
            color: 'var(--primary-deep)',
            fontWeight: 700,
            marginBottom: '12px',
            lineHeight: 1.2
          }}>
            {product.name}
          </h1>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary-deep)' }}>
              Rs. {product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span style={{ fontSize: '1.1rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                Rs. {product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '24px' }}>
            {product.description}
          </p>

          {/* Crafting Lead-Time Notice Box */}
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-pink)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <Clock size={20} color="var(--primary-dark)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 700, color: 'var(--primary-deep)', fontSize: '0.88rem' }}>
                Handmade Crafting Notice
              </div>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {product.craftingNotice || 'Handmade in small batches — please allow 5–7 days for your piece to ship.'}
              </div>
            </div>
          </div>

          {/* Custom Note input for WhatsApp */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--primary-deep)', marginBottom: '4px', display: 'block' }}>
              Custom Request / Note (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Size preference (S/M/L), custom color request..."
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-pink)',
                backgroundColor: 'var(--bg-secondary)',
                fontSize: '0.88rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Quantity & WhatsApp CTA */}
          <div style={{ display: 'flex', gap: '14px', marginBottom: '32px', flexWrap: 'wrap' }}>
            {/* Quantity Selector */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-pink)',
              borderRadius: 'var(--radius-pill)',
              padding: '4px 8px'
            }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  color: 'var(--primary-deep)',
                  fontWeight: 700
                }}
              >
                -
              </button>
              <span style={{ padding: '0 16px', fontWeight: 700, fontSize: '1rem', color: 'var(--text-dark)' }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  color: 'var(--primary-deep)',
                  fontWeight: 700
                }}
              >
                +
              </button>
            </div>

            {/* WhatsApp CTA Button */}
            <button
              onClick={() => openWhatsAppInquiry(product, quantity, customNote)}
              style={{
                flexGrow: 1,
                backgroundColor: '#8C3149',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-pill)',
                padding: '14px 28px',
                fontSize: '1rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 6px 20px rgba(140, 49, 73, 0.25)',
                transition: 'var(--transition)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#74263B';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#8C3149';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <MessageCircle size={22} fill="#FFFFFF" />
              <span>Inquire on WhatsApp • Rs. {totalPrice.toLocaleString('en-IN')}</span>
            </button>
          </div>

          {/* Specifications Table */}
          {product.specifications && (
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-pink)',
              padding: '20px'
            }}>
              <h4 style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary-deep)', fontSize: '1.1rem', marginBottom: '14px' }}>
                Catalog Details & Specifications
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {product.specifications.map((spec, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', paddingBottom: '8px', borderBottom: idx < product.specifications.length - 1 ? '1px solid #F8ECEF' : 'none' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{spec.label}:</span>
                    <span style={{ color: 'var(--text-muted)', textAlign: 'right', maxWidth: '65%' }}>{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Catalog Items */}
      {relatedProducts.length > 0 && (
        <section style={{ borderTop: '1px solid var(--border-pink)', paddingTop: '50px' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--primary-deep)', marginBottom: '28px' }}>
            More from the Collection
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '24px'
          }}>
            {relatedProducts.slice(0, 3).map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
