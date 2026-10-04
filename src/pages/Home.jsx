import React from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { useShop, generateGeneralWhatsAppLink } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';

export const Home = () => {
  const { products, loadingCatalog, goToShop, openWhatsAppInquiry } = useShop();

  return (
    <div>
      {/* Hero Catalog Showcase Section */}
      <section style={{
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF4F7 100%)',
        padding: '50px 0 70px 0',
        borderBottom: '1px solid #F0E6E8'
      }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '48px',
          alignItems: 'center'
        }}>
          {/* Left Text */}
          <div className="animate-fade-in">
            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
              fontWeight: 700,
              color: '#000000',
              lineHeight: 1.15,
              marginBottom: '20px',
              letterSpacing: '-0.02em'
            }}>
              The art of subtle luxury, <br />
              <span style={{ color: '#000000', fontStyle: 'italic' }}>handcrafted 🪡</span>
            </h1>

            <p style={{
              fontSize: '1.08rem',
              color: '#6E5C62',
              lineHeight: 1.6,
              marginBottom: '32px',
              maxWidth: '520px'
            }}>
              Explore our handmade catalog of crochet accessories. Order & inquire directly on WhatsApp.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              <button
                onClick={() => goToShop('all')}
                className="btn-primary"
                style={{ fontSize: '1rem', padding: '14px 32px' }}
              >
                <span>Browse Collection</span>
                <ArrowRight size={18} />
              </button>

              <a
                href={generateGeneralWhatsAppLink()}
                target="_blank"
                rel="noreferrer"
                style={{
                  backgroundColor: '#8C3149',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '1rem',
                  padding: '14px 28px',
                  borderRadius: '9999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 16px rgba(140, 49, 73, 0.25)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#74263B'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8C3149'}
              >
                <MessageCircle size={20} fill="#FFFFFF" />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>

          {/* Right Visual Showcase */}
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '100%',
              maxWidth: '450px',
              height: '450px',
              borderRadius: '24px',
              backgroundColor: '#FFF0F3',
              border: '2px solid #F4C4D0',
              boxShadow: '0 12px 32px -8px rgba(232, 122, 147, 0.2)',
              overflow: 'hidden',
              position: 'relative',
              margin: '0 auto'
            }}>
              <img
                src="/images/bonbon-bunny.jpg"
                alt="Bonbon Bunny"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Floating Highlight Card */}
              <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                right: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 10px 30px rgba(140, 49, 73, 0.15)',
                border: '1px solid #F4C4D0'
              }}>
                <div>
                  <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#9C3852', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Catalog Highlight
                  </div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 700, color: '#5C2232' }}>
                    Bonbon the Bunny
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#3A2E32' }}>
                    Rs. 1,299
                  </div>
                </div>

                <button
                  onClick={() => openWhatsAppInquiry({
                    name: 'Bonbon the Bunny',
                    price: 1299,
                    category: 'Plushies',
                    description: 'Extra-soft cotton plush bunny handcrafted with hypoallergenic polyfill. Features a hand-stitched blush heart on its chest and cute floppy ears.',
                    image: '/images/bonbon-bunny.jpg'
                  })}
                  style={{
                    backgroundColor: '#8C3149',
                    color: '#FFF',
                    borderRadius: '9999px',
                    padding: '8px 16px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#74263B'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8C3149'}
                >
                  <MessageCircle size={14} fill="#FFF" />
                  <span>Inquire</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Catalog Items Grid */}
      <section className="container" style={{ marginTop: '70px', marginBottom: '80px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#9C3852', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
              Crafted in Batches
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: '#5C2232', fontWeight: 700 }}>
              Featured Collection
            </h2>
          </div>

          <button
            onClick={() => goToShop('all')}
            className="btn-secondary"
          >
            <span>View Catalog ({products.length})</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {loadingCatalog ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#8C757C' }}>
            Loading catalog...
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '28px'
          }}>
            {products.slice(0, 6).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
