import React, { useState } from 'react';
import { MessageCircle, Menu, X } from 'lucide-react';
import { useShop, generateGeneralWhatsAppLink } from '../context/ShopContext';

export const Navbar = () => {
  const { currentView, goToHome, goToShop } = useShop();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: '#FFFFFF', borderBottom: '1px solid #F0E6E8' }}>
      {/* Main Navbar */}
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '74px' }}>
        {/* Brand Logo with Custom Yarn Heart Image */}
        <div
          onClick={goToHome}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
        >
          <img
            src="/images/logo.jpg"
            alt="krosheknote logo"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1.5px solid #F4C4D0',
              boxShadow: '0 2px 8px rgba(232, 122, 147, 0.15)'
            }}
          />
          <div>
            <div style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.45rem',
              fontWeight: 700,
              color: '#5C2232',
              lineHeight: 1.1
            }}>
              krosheknote
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '36px' }} className="desktop-nav">
          <button
            onClick={goToHome}
            style={{
              fontSize: '0.98rem',
              fontWeight: currentView === 'home' ? 700 : 500,
              color: currentView === 'home' ? '#9C3852' : '#3A2E32',
              borderBottom: currentView === 'home' ? '2px solid #9C3852' : '2px solid transparent',
              padding: '6px 0',
              transition: 'all 0.2s ease'
            }}
          >
            Home
          </button>

          <button
            onClick={() => goToShop('all')}
            style={{
              fontSize: '0.98rem',
              fontWeight: currentView === 'shop' ? 700 : 500,
              color: currentView === 'shop' ? '#9C3852' : '#3A2E32',
              borderBottom: currentView === 'shop' ? '2px solid #9C3852' : '2px solid transparent',
              padding: '6px 0',
              transition: 'all 0.2s ease'
            }}
          >
            Collection
          </button>
        </nav>

        {/* WhatsApp Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a
            href={generateGeneralWhatsAppLink()}
            target="_blank"
            rel="noreferrer"
            style={{
              backgroundColor: '#8C3149',
              color: '#FFFFFF',
              borderRadius: '9999px',
              padding: '9px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 600,
              fontSize: '0.88rem',
              boxShadow: '0 3px 12px rgba(140, 49, 73, 0.2)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#74263B'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8C3149'}
          >
            <MessageCircle size={18} fill="#FFFFFF" />
            <span>WhatsApp Us</span>
          </a>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none', color: '#5C2232' }}
            className="mobile-toggle"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #F0E6E8',
          padding: '16px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          <button
            onClick={() => { goToHome(); setMobileMenuOpen(false); }}
            style={{ textAlign: 'left', fontSize: '1rem', fontWeight: 600, color: '#5C2232' }}
          >
            Home
          </button>
          <button
            onClick={() => { goToShop('all'); setMobileMenuOpen(false); }}
            style={{ textAlign: 'left', fontSize: '1rem', fontWeight: 600, color: '#5C2232' }}
          >
            Collection
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
      `}</style>
    </header>
  );
};
