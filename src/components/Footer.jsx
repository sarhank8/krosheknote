import React from 'react';
import { Mail, ShieldCheck, Camera, MessageCircle } from 'lucide-react';
import { generateGeneralWhatsAppLink } from '../context/ShopContext';

export const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#FFFFFF',
      borderTop: '1px solid #F0E6E8',
      marginTop: '80px',
      paddingTop: '50px',
      paddingBottom: '30px'
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '30px',
          marginBottom: '40px'
        }}>
          {/* Brand Info with Custom Yarn Heart Logo */}
          <div style={{ maxWidth: '480px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <img
                src="/images/logo.jpg"
                alt="krosheknote logo"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1px solid #F4C4D0'
                }}
              />
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', fontWeight: 700, color: '#5C2232' }}>
                krosheknote
              </div>
            </div>
            <p style={{ fontSize: '0.92rem', color: '#6E5C62', lineHeight: 1.6, marginBottom: '18px' }}>
              Explore our handmade catalog of crochet accessories. Order & inquire directly on WhatsApp.
            </p>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <a
                href="https://www.instagram.com/krosheknote/"
                target="_blank"
                rel="noreferrer"
                title="@krosheknote Instagram"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#FFF0F3',
                  color: '#5C2232',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                <Camera size={18} />
              </a>
              <a
                href="mailto:krosheknote@gmail.com"
                title="krosheknote@gmail.com"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#FFF0F3',
                  color: '#5C2232',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Contact Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: '#6E5C62' }}>
            <div style={{ fontFamily: 'var(--font-serif)', color: '#5C2232', fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>
              Get in Touch
            </div>
            <div>
              <strong>Instagram:</strong>{' '}
              <a href="https://www.instagram.com/krosheknote/" target="_blank" rel="noreferrer" style={{ color: '#9C3852', fontWeight: 600 }}>
                @krosheknote
              </a>
            </div>
            <div>
              <strong>Email:</strong>{' '}
              <a href="mailto:krosheknote@gmail.com" style={{ color: '#9C3852', fontWeight: 600 }}>
                krosheknote@gmail.com
              </a>
            </div>
            <div>
              <a
                href={generateGeneralWhatsAppLink()}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: '#8C3149',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginTop: '4px'
                }}
              >
                <MessageCircle size={16} fill="#8C3149" />
                <span>Order via WhatsApp (+91 84879 93896)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid #F8ECEF',
          paddingTop: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          fontSize: '0.84rem',
          color: '#6E5C62'
        }}>
          <div>
            © {new Date().getFullYear()} krosheknote. All rights reserved.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#5C2232', fontWeight: 600 }}>
            <ShieldCheck size={16} />
            <span>100% Hand-Stitched Cotton</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
