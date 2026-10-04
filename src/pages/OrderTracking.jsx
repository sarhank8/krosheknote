import React, { useState, useEffect } from 'react';
import { Search, Package, CheckCircle2, Clock, MapPin, Truck, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const OrderTracking = () => {
  const { goToShop } = useShop();
  const [searchQuery, setSearchQuery] = useState('KRN-84920');
  const [order, setOrder] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    // Fetch default orders list on page load
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.orders.length > 0) {
          setRecentOrders(data.orders);
          setOrder(data.orders[0]); // default to first order
          setSearchQuery(data.orders[0].id);
          setSearched(true);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setSearched(true);

    fetch(`/api/orders?search=${encodeURIComponent(searchQuery)}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.orders.length > 0) {
          setOrder(data.orders[0]);
        } else {
          setOrder(null);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const getStepStatus = (statusName) => {
    if (!order) return 'upcoming';
    const stages = ['Tucked In', 'Handcrafted', 'Shipped', 'Delivered'];
    const currentIdx = stages.indexOf(order.status || 'Tucked In');
    const targetIdx = stages.indexOf(statusName);

    if (targetIdx < currentIdx) return 'completed';
    if (targetIdx === currentIdx) return 'current';
    return 'upcoming';
  };

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '90px', maxWidth: '840px' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--bg-secondary)', padding: '4px 14px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-pink)', marginBottom: '12px' }}>
          <Sparkles size={14} color="var(--primary)" />
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--primary-deep)' }}>
            Live Workshop Order Tracker
          </span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', color: 'var(--primary-deep)', fontWeight: 700, marginBottom: '8px' }}>
          Track Your Handmade Order
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Enter your Order ID (e.g. <strong>KRN-84920</strong>) or Email to check crafting status.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} style={{
        display: 'flex',
        gap: '12px',
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-pill)',
        padding: '6px 10px 6px 20px',
        border: '1.5px solid var(--border-pink)',
        boxShadow: 'var(--shadow-card)',
        marginBottom: '40px'
      }}>
        <input
          type="text"
          placeholder="Enter Order ID or Email address..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flexGrow: 1,
            border: 'none',
            outline: 'none',
            fontSize: '1rem',
            color: 'var(--text-dark)'
          }}
        />
        <button
          type="submit"
          className="btn-primary"
          style={{ padding: '10px 24px' }}
        >
          <Search size={16} />
          <span>Track Status</span>
        </button>
      </form>

      {/* Results */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-muted)' }}>
          Checking workshop logs...
        </div>
      ) : order ? (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-pink)',
          padding: '32px',
          boxShadow: 'var(--shadow-card)',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          {/* Header info */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', borderBottom: '1px solid #F8ECEF', paddingBottom: '20px', marginBottom: '32px' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-dark)', textTransform: 'uppercase' }}>
                Order #{order.id}
              </div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary-deep)' }}>
                Placed by {order.customer?.name}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Date: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>

            <span style={{
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--primary-deep)',
              fontWeight: 700,
              padding: '8px 18px',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--border-pink)',
              fontSize: '0.9rem'
            }}>
              Current Status: 🌸 {order.status || 'Tucked In'}
            </span>
          </div>

          {/* Status Timeline */}
          <div style={{ marginBottom: '40px' }}>
            <h4 style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary-deep)', fontSize: '1.1rem', marginBottom: '24px' }}>
              Crafting & Delivery Steps
            </h4>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px',
              position: 'relative'
            }}>
              {[
                { title: 'Tucked In', desc: 'Order logged' },
                { title: 'Handcrafted', desc: 'Stitched with yarn' },
                { title: 'Shipped', desc: 'Out for delivery' },
                { title: 'Delivered', desc: 'In your hands' }
              ].map((step, idx) => {
                const status = getStepStatus(step.title);
                const isCurrent = status === 'current';
                const isCompleted = status === 'completed' || isCurrent;

                return (
                  <div key={idx} style={{ textAlign: 'center', position: 'relative' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      backgroundColor: isCompleted ? 'var(--primary-deep)' : 'var(--bg-secondary)',
                      color: isCompleted ? '#FFFFFF' : 'var(--text-light)',
                      border: `2px solid ${isCompleted ? 'var(--primary)' : 'var(--border-pink)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 10px auto',
                      fontWeight: 700,
                      fontSize: '0.9rem'
                    }}>
                      {isCompleted ? '✓' : idx + 1}
                    </div>

                    <div style={{ fontSize: '0.88rem', fontWeight: isCurrent ? 700 : 600, color: isCurrent ? 'var(--primary-deep)' : 'var(--text-dark)' }}>
                      {step.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {step.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items Summary */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary-deep)', fontSize: '1.1rem', marginBottom: '14px' }}>
              Items in Parcel
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {order.items?.map((item, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  backgroundColor: 'var(--bg-main)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-pink)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={item.image} alt={item.name} style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--primary-deep)', fontSize: '0.92rem' }}>{item.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--primary-deep)' }}>
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : searched ? (
        <div style={{
          textAlign: 'center',
          padding: '50px 20px',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-pink)'
        }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary-deep)', fontSize: '1.3rem', marginBottom: '8px' }}>
            No order found for "{searchQuery}"
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
            Try searching with <strong>KRN-84920</strong> or place a new order to test real-time tracking.
          </p>
          <button onClick={() => goToShop('all')} className="btn-primary">
            Browse Collection
          </button>
        </div>
      ) : null}

      {/* Quick Select Recent Orders */}
      {recentOrders.length > 0 && (
        <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-pink)' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-deep)', marginBottom: '10px' }}>
            Recent Orders in Backend Storage:
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {recentOrders.map(o => (
              <button
                key={o.id}
                onClick={() => {
                  setSearchQuery(o.id);
                  setOrder(o);
                }}
                style={{
                  backgroundColor: searchQuery === o.id ? 'var(--primary-deep)' : 'var(--bg-secondary)',
                  color: searchQuery === o.id ? '#FFF' : 'var(--primary-deep)',
                  border: '1px solid var(--border-pink)',
                  borderRadius: 'var(--radius-pill)',
                  padding: '6px 14px',
                  fontSize: '0.82rem',
                  fontWeight: 600
                }}
              >
                #{o.id} ({o.customer?.name})
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
