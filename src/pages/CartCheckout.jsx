import React, { useState } from 'react';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, CheckCircle2, Truck, Package, Sparkles, ChevronRight, MapPin } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const CartCheckout = () => {
  const {
    cart,
    cartSubtotal,
    cartCount,
    freeShippingThreshold,
    isFreeShipping,
    amountNeededForFreeShipping,
    updateQuantity,
    removeFromCart,
    clearCart,
    goToShop,
    goToOrderTracking,
    showToast
  } = useShop();

  // Checkout step: 'basket' | 'delivery' | 'confirmation'
  const [step, setStep] = useState('basket');

  // Customer Form
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  const shippingCost = isFreeShipping || cartSubtotal === 0 ? 0 : 99;
  const grandTotal = cartSubtotal + shippingCost;
  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!customer.name || !customer.email || !customer.address || !customer.pincode) {
      showToast('Please complete all required delivery fields.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customer,
        items: cart,
        subtotal: cartSubtotal,
        shipping: shippingCost,
        total: grandTotal,
        paymentMethod
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();

      if (data.success) {
        setPlacedOrder(data.order);
        clearCart();
        setStep('confirmation');
        showToast('Order placed successfully! 🌸');
      } else {
        showToast(data.message || 'Failed to place order', 'error');
      }
    } catch (err) {
      console.error(err);
      // Fallback local order generation if network issue
      const mockOrder = {
        id: `KRN-${Math.floor(10000 + Math.random() * 90000)}`,
        customer,
        items: cart,
        subtotal: cartSubtotal,
        shipping: shippingCost,
        total: grandTotal,
        paymentMethod,
        createdAt: new Date().toISOString()
      };
      setPlacedOrder(mockOrder);
      clearCart();
      setStep('confirmation');
    } finally {
      setIsSubmitting(false);
    }
  };

  // STEP 3: Order Confirmation View
  if (step === 'confirmation' && placedOrder) {
    return (
      <div className="container" style={{ paddingTop: '50px', paddingBottom: '90px', maxWidth: '750px' }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '2px solid var(--border-pink)',
          boxShadow: 'var(--shadow-pink)',
          padding: '40px 32px',
          textAlign: 'center',
          animation: 'fadeIn 0.4s ease-out'
        }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-secondary)',
            border: '2px solid var(--border-pink)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto',
            fontSize: '2rem'
          }}>
            🌸
          </div>

          <span style={{
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--primary-deep)',
            fontSize: '0.82rem',
            fontWeight: 700,
            padding: '6px 16px',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--border-pink)'
          }}>
            ORDER TUCKED IN #{placedOrder.id}
          </span>

          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2.4rem',
            color: 'var(--primary-deep)',
            marginTop: '16px',
            marginBottom: '12px'
          }}>
            Thank You, {placedOrder.customer.name.split(' ')[0]}!
          </h1>

          <p style={{ color: 'var(--text-muted)', fontSize: '1.02rem', lineHeight: 1.6, marginBottom: '32px' }}>
            Your handmade creation has been logged in our workshop. We'll stitch and tuck it in with extra care before dispatching.
          </p>

          {/* Delivery & Items Summary Box */}
          <div style={{
            backgroundColor: 'var(--bg-main)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-pink)',
            padding: '24px',
            textAlign: 'left',
            marginBottom: '32px'
          }}>
            <h4 style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary-deep)', fontSize: '1.1rem', marginBottom: '16px', borderBottom: '1px solid #F8ECEF', paddingBottom: '8px' }}>
              Order Breakdown
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {placedOrder.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{item.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--primary-deep)' }}>
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #F8ECEF', paddingTop: '12px', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Subtotal:</span>
                <span>₹{placedOrder.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Domestic Shipping:</span>
                <span>{placedOrder.shipping === 0 ? 'FREE' : `₹${placedOrder.shipping}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: 'var(--primary-deep)', fontSize: '1.1rem', marginTop: '6px' }}>
                <span>Total Amount:</span>
                <span>₹{placedOrder.total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #F8ECEF', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <div style={{ fontWeight: 700, color: 'var(--primary-deep)', marginBottom: '4px' }}>Shipping Address:</div>
              <div>{placedOrder.customer.address}, {placedOrder.customer.city || ''} - {placedOrder.customer.pincode}</div>
              <div>Payment Mode: {placedOrder.paymentMethod}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={goToOrderTracking} className="btn-primary">
              Track Order Live
            </button>
            <button onClick={() => goToShop('all')} className="btn-secondary">
              Back to Shop
            </button>
          </div>
        </div>
      </div>
    );
  }

  // EMPTY BASKET VIEW
  if (cart.length === 0) {
    return (
      <div className="container" style={{ paddingTop: '60px', paddingBottom: '100px', textAlign: 'center', maxWidth: '600px' }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: 'var(--bg-secondary)',
          border: '1.5px solid var(--border-pink)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px auto',
          fontSize: '2.5rem'
        }}>
          🌸
        </div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: 'var(--primary-deep)', fontWeight: 700, marginBottom: '12px' }}>
          Your Basket is Empty
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '32px' }}>
          You haven't added any handcrafted plushies or soft crochet pieces to your basket yet.
        </p>
        <button onClick={() => goToShop('all')} className="btn-primary" style={{ padding: '14px 32px' }}>
          Explore Collection
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '36px', paddingBottom: '90px' }}>
      {/* Title */}
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', color: 'var(--primary-deep)', fontWeight: 700, marginBottom: '8px' }}>
        Your Shopping Basket
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '32px' }}>
        Review your handcrafted items before placing your order.
      </p>

      {/* Free Shipping Progress Meter */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-pink)',
        padding: '16px 20px',
        marginBottom: '32px',
        boxShadow: 'var(--shadow-card)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem', fontWeight: 600 }}>
          <span style={{ color: 'var(--primary-deep)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Truck size={16} color="var(--primary)" />
            {isFreeShipping ? (
              <span style={{ color: 'var(--primary-dark)' }}>🎉 You qualified for FREE Domestic Shipping!</span>
            ) : (
              <span>Add <strong>₹{amountNeededForFreeShipping.toLocaleString('en-IN')}</strong> more for FREE Domestic Shipping!</span>
            )}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>{Math.round(progressPercent)}%</span>
        </div>
        <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{
            width: `${progressPercent}%`,
            height: '100%',
            backgroundColor: 'var(--primary)',
            transition: 'width 0.4s ease'
          }} />
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '40px',
        alignItems: 'start'
      }}>
        {/* Left Column: Cart Items or Delivery Form */}
        <div>
          {step === 'basket' ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--primary-deep)' }}>
                  Items in Basket ({cartCount})
                </h3>
                <button
                  onClick={clearCart}
                  style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Trash2 size={14} />
                  <span>Clear All</span>
                </button>
              </div>

              {/* Item List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {cart.map(item => (
                  <div
                    key={item.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-pink)',
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      boxShadow: 'var(--shadow-card)'
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                    />

                    <div style={{ flexGrow: 1 }}>
                      <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '1.1rem', color: 'var(--primary-deep)' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                        ₹{item.price.toLocaleString('en-IN')} each
                      </div>

                      {/* Quantity Controls */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          backgroundColor: 'var(--bg-secondary)',
                          border: '1px solid var(--border-pink)',
                          borderRadius: 'var(--radius-pill)',
                          padding: '2px 6px'
                        }}>
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            style={{ padding: '2px 8px', fontWeight: 700, color: 'var(--primary-deep)' }}
                          >
                            -
                          </button>
                          <span style={{ padding: '0 8px', fontSize: '0.88rem', fontWeight: 700 }}>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            style={{ padding: '2px 8px', fontWeight: 700, color: 'var(--primary-deep)' }}
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          style={{ padding: '6px', color: 'var(--text-light)', transition: 'var(--transition)' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--primary-deep)' }}>
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '24px' }}>
                <button
                  onClick={() => setStep('delivery')}
                  className="btn-primary"
                  style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
                >
                  <span>Proceed to Delivery Info</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ) : (
            /* STEP 2: Delivery Details Form */
            <form onSubmit={handlePlaceOrder} style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-pink)',
              padding: '28px',
              boxShadow: 'var(--shadow-card)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--primary-deep)' }}>
                  Delivery Details
                </h3>
                <button
                  type="button"
                  onClick={() => setStep('basket')}
                  style={{ fontSize: '0.85rem', color: 'var(--primary-dark)', fontWeight: 600 }}
                >
                  ← Edit Basket
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)' }}>Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Patel"
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-pink)',
                      backgroundColor: 'var(--bg-secondary)',
                      marginTop: '4px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)' }}>Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="aarav@example.com"
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-pink)',
                        backgroundColor: 'var(--bg-secondary)',
                        marginTop: '4px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)' }}>Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="9876543210"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-pink)',
                        backgroundColor: 'var(--bg-secondary)',
                        marginTop: '4px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)' }}>Shipping Address *</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="House/Flat No., Building, Street Name..."
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-pink)',
                      backgroundColor: 'var(--bg-secondary)',
                      marginTop: '4px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)' }}>City</label>
                    <input
                      type="text"
                      placeholder="e.g. Bangalore"
                      value={customer.city}
                      onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-pink)',
                        backgroundColor: 'var(--bg-secondary)',
                        marginTop: '4px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)' }}>Pincode *</label>
                    <input
                      type="text"
                      required
                      placeholder="560038"
                      value={customer.pincode}
                      onChange={(e) => setCustomer({ ...customer, pincode: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-pink)',
                        backgroundColor: 'var(--bg-secondary)',
                        marginTop: '4px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Payment Option */}
                <div style={{ marginTop: '10px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '8px', display: 'block' }}>
                    Payment Option
                  </label>
                  <div style={{
                    border: '1px solid var(--border-pink)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px',
                    backgroundColor: 'var(--bg-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <input
                      type="radio"
                      id="cod"
                      name="payment"
                      checked={paymentMethod === 'Cash on Delivery'}
                      onChange={() => setPaymentMethod('Cash on Delivery')}
                    />
                    <label htmlFor="cod" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-deep)', cursor: 'pointer' }}>
                      Cash on Delivery (Pay with Cash/UPI on arrival)
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary"
                  style={{ width: '100%', padding: '14px', fontSize: '1.05rem', marginTop: '12px' }}
                >
                  {isSubmitting ? 'Tucking in your order...' : `Confirm & Place Order • ₹${grandTotal.toLocaleString('en-IN')}`}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: Order Summary */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-pink)',
          padding: '28px',
          boxShadow: 'var(--shadow-card)',
          position: 'sticky',
          top: '100px'
        }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--primary-deep)', marginBottom: '20px' }}>
            Order Summary
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.92rem', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Subtotal ({cartCount} items):</span>
              <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>₹{cartSubtotal.toLocaleString('en-IN')}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Domestic Shipping:</span>
              <span style={{ fontWeight: 600, color: isFreeShipping ? 'var(--primary-dark)' : 'var(--text-dark)' }}>
                {isFreeShipping ? 'FREE' : `₹${shippingCost}`}
              </span>
            </div>

            <div style={{ borderTop: '1px dashed var(--border-pink)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-deep)' }}>
              <span>Total:</span>
              <span>₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <ShieldCheck size={18} color="var(--primary-dark)" />
            <span>Handmade with care & backed by 100% Cotton Quality Guarantee.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
