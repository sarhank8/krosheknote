import React, { useState, useEffect } from 'react';
import { Lock, Plus, Trash2, Upload, Tag, Package, Check, AlertCircle, LogOut, ArrowLeft } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const AdminPanel = () => {
  const { showToast, products, categories, refreshCatalog, loadingCatalog, goToHome } = useShop();

  // Session Token
  const [adminToken, setAdminToken] = useState(() => {
    return sessionStorage.getItem('krn_admin_token') || '';
  });

  // Login Form
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Active Admin Tab: 'products' | 'add-product' | 'categories'
  const [activeTab, setActiveTab] = useState('products');

  // New Product Form state
  const [newProd, setNewProd] = useState({
    name: '',
    category: 'Plushies',
    price: '',
    originalPrice: '',
    description: '',
    craftingNotice: 'Handmade in small batches — please allow 5–7 days for your piece to ship.',
    image: '',
    specifications: [
      { label: 'Materials', value: '100% Combed Cotton Yarn' },
      { label: 'Care', value: 'Spot clean or gentle hand wash in cold water' }
    ]
  });

  // File Upload State
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  // New Category Form state
  const [newCatName, setNewCatName] = useState('');
  const [submittingCat, setSubmittingCat] = useState(false);

  // Submitting Product State
  const [submittingProduct, setSubmittingProduct] = useState(false);

  useEffect(() => {
    if (adminToken) {
      refreshCatalog();
    }
  }, [adminToken]);

  // Handle Admin Login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!passwordInput) return;

    setLoggingIn(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });

      const data = await res.json();

      if (data.success && data.token) {
        setAdminToken(data.token);
        sessionStorage.setItem('krn_admin_token', data.token);
        setPasswordInput('');
        showToast('Admin session started successfully');
        refreshCatalog();
      } else {
        setLoginError(data.message || 'Incorrect password');
      }
    } catch (err) {
      setLoginError('Server error. Please try again.');
    } finally {
      setLoggingIn(false);
    }
  };

  // Handle Admin Logout
  const handleLogout = () => {
    setAdminToken('');
    sessionStorage.removeItem('krn_admin_token');
    showToast('Admin logged out');
  };

  // Handle File Upload to /api/admin/upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    setUploadingImage(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        },
        body: formData
      });

      const data = await res.json();

      if (data.success && data.imageUrl) {
        setNewProd(prev => ({ ...prev, image: data.imageUrl }));
        showToast('Product image uploaded successfully!');
      } else {
        showToast(data.message || 'Image upload failed', 'error');
      }
    } catch (err) {
      showToast('Error uploading image file', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  // Specification Key-Value Handlers
  const handleAddSpec = () => {
    setNewProd(prev => ({
      ...prev,
      specifications: [...prev.specifications, { label: '', value: '' }]
    }));
  };

  const handleUpdateSpec = (index, field, val) => {
    setNewProd(prev => {
      const updated = [...prev.specifications];
      updated[index][field] = val;
      return { ...prev, specifications: updated };
    });
  };

  const handleRemoveSpec = (index) => {
    setNewProd(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  // Handle Add Product Submit
  const handleCreateProduct = async (e) => {
    e.preventDefault();

    if (!newProd.name || !newProd.price || !newProd.description || !newProd.image) {
      showToast('Please fill in product name, price, description, and upload an image.', 'error');
      return;
    }

    setSubmittingProduct(true);

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(newProd)
      });

      const data = await res.json();

      if (data.success) {
        showToast(`Added "${newProd.name}" to catalog!`);
        await refreshCatalog(); // Real-time customer site sync!
        setActiveTab('products');

        // Reset form
        setNewProd({
          name: '',
          category: 'Plushies',
          price: '',
          originalPrice: '',
          description: '',
          craftingNotice: 'Handmade in small batches — please allow 5–7 days for your piece to ship.',
          image: '',
          specifications: [
            { label: 'Materials', value: '100% Combed Cotton Yarn' },
            { label: 'Care', value: 'Spot clean or gentle hand wash in cold water' }
          ]
        });
        setImagePreview('');
      } else {
        showToast(data.message || 'Failed to create product', 'error');
      }
    } catch (err) {
      showToast('Server error creating product', 'error');
    } finally {
      setSubmittingProduct(false);
    }
  };

  // Handle Delete Product
  const handleDeleteProduct = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to remove "${productName}" from the catalog?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      const data = await res.json();

      if (data.success) {
        showToast(`Removed "${productName}" from catalog.`);
        await refreshCatalog(); // Real-time customer site sync!
      } else {
        showToast(data.message || 'Failed to remove product', 'error');
      }
    } catch (err) {
      showToast('Error removing product', 'error');
    }
  };

  // Handle Add Category
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setSubmittingCat(true);

    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ name: newCatName.trim() })
      });

      const data = await res.json();

      if (data.success) {
        showToast(`Category "${newCatName}" added!`);
        setNewCatName('');
        await refreshCatalog(); // Real-time customer site sync!
      } else {
        showToast(data.message || 'Failed to add category', 'error');
      }
    } catch (err) {
      showToast('Error adding category', 'error');
    } finally {
      setSubmittingCat(false);
    }
  };

  // Handle Delete Category
  const handleDeleteCategory = async (categorySlug, categoryName) => {
    if (categorySlug.toLowerCase() === 'all') {
      showToast('Cannot delete default "All" category', 'error');
      return;
    }

    if (!window.confirm(`Are you sure you want to remove the category "${categoryName}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/categories/${categorySlug}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      const data = await res.json();

      if (data.success) {
        showToast(`Category "${categoryName}" removed.`);
        await refreshCatalog(); // Real-time customer site sync!
      } else {
        showToast(data.message || 'Failed to remove category', 'error');
      }
    } catch (err) {
      showToast('Error removing category', 'error');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFF8F9', paddingBottom: '60px' }}>
      {/* Admin Dedicated Navbar */}
      <header style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #F0E6E8', padding: '16px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img src="/images/logo.jpg" alt="logo" style={{ width: '42px', height: '42px', borderRadius: '50%' }} />
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', color: '#5C2232', fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>
                krosheknote Admin Panel
              </h2>
              <div style={{ fontSize: '0.78rem', color: '#7A2E43' }}>Real-time Catalog Control (http://localhost:5000/admin)</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => { window.location.href = '/'; }}
              style={{
                backgroundColor: '#FFF0F3',
                color: '#5C2232',
                border: '1px solid #F4C4D0',
                borderRadius: '9999px',
                padding: '8px 16px',
                fontSize: '0.85rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <ArrowLeft size={16} />
              <span>View Customer Site</span>
            </button>

            {adminToken && (
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: '#8C3149',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '8px 16px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="container" style={{ paddingTop: '36px' }}>
        {!adminToken ? (
          /* LOGIN VIEW */
          <div style={{
            maxWidth: '440px',
            margin: '40px auto',
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid #F0E6E8',
            boxShadow: '0 12px 36px rgba(92, 34, 50, 0.1)',
            padding: '36px 30px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#FFF0F3',
              border: '1.5px solid #F4C4D0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              color: '#8C3149'
            }}>
              <Lock size={28} />
            </div>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#5C2232', fontWeight: 700, marginBottom: '8px' }}>
              Admin Login
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#6E5C62', marginBottom: '24px' }}>
              Enter security password to access catalog control panel.
            </p>

            {loginError && (
              <div style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FCA5A5',
                color: '#991B1B',
                borderRadius: '12px',
                padding: '10px 14px',
                fontSize: '0.85rem',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertCircle size={16} />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input
                type="password"
                placeholder="Enter Admin Password..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                autoFocus
                required
                style={{
                  width: '100%',
                  padding: '12px 18px',
                  borderRadius: '9999px',
                  border: '1px solid #F4C4D0',
                  backgroundColor: '#FFF8F9',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />

              <button
                type="submit"
                disabled={loggingIn}
                className="btn-primary"
                style={{ width: '100%', padding: '12px' }}
              >
                {loggingIn ? 'Verifying...' : 'Unlock Admin Dashboard'}
              </button>
            </form>
          </div>
        ) : (
          /* DASHBOARD VIEW */
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid #F0E6E8',
            boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
            padding: '32px'
          }}>
            {/* Tabs Bar */}
            <div style={{
              display: 'flex',
              gap: '12px',
              borderBottom: '1px solid #F0E6E8',
              paddingBottom: '16px',
              marginBottom: '28px',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => setActiveTab('products')}
                style={{
                  backgroundColor: activeTab === 'products' ? '#8C3149' : '#FFF0F3',
                  color: activeTab === 'products' ? '#FFFFFF' : '#8C3149',
                  border: '1px solid #F4C4D0',
                  borderRadius: '9999px',
                  padding: '9px 20px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Package size={16} />
                <span>Products Catalog ({products.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('add-product')}
                style={{
                  backgroundColor: activeTab === 'add-product' ? '#8C3149' : '#FFF0F3',
                  color: activeTab === 'add-product' ? '#FFFFFF' : '#8C3149',
                  border: '1px solid #F4C4D0',
                  borderRadius: '9999px',
                  padding: '9px 20px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Plus size={16} />
                <span>Add New Product</span>
              </button>

              <button
                onClick={() => setActiveTab('categories')}
                style={{
                  backgroundColor: activeTab === 'categories' ? '#8C3149' : '#FFF0F3',
                  color: activeTab === 'categories' ? '#FFFFFF' : '#8C3149',
                  border: '1px solid #F4C4D0',
                  borderRadius: '9999px',
                  padding: '9px 20px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Tag size={16} />
                <span>Manage Categories ({categories.length})</span>
              </button>
            </div>

            {/* TAB 1: PRODUCTS LIST */}
            {activeTab === 'products' && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#5C2232', marginBottom: '20px' }}>
                  Current Catalog Products
                </h3>

                {loadingCatalog ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#8C757C' }}>Loading products...</div>
                ) : products.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {products.map(p => (
                      <div
                        key={p.id}
                        style={{
                          backgroundColor: '#FFF8F9',
                          borderRadius: '16px',
                          border: '1px solid #F4C4D0',
                          padding: '16px 20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '16px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <img
                            src={p.image}
                            alt={p.name}
                            style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, color: '#5C2232', fontSize: '1.1rem' }}>{p.name}</div>
                            <div style={{ fontSize: '0.84rem', color: '#6E5C62' }}>
                              Category: <strong>{p.category}</strong> • Price: <strong>Rs. {p.price}</strong>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          style={{
                            backgroundColor: '#FEF2F2',
                            color: '#991B1B',
                            border: '1px solid #FCA5A5',
                            borderRadius: '9999px',
                            padding: '8px 16px',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <Trash2 size={14} />
                          <span>Remove</span>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#8C757C' }}>No products found.</div>
                )}
              </div>
            )}

            {/* TAB 2: ADD NEW PRODUCT FORM */}
            {activeTab === 'add-product' && (
              <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#5C2232', margin: 0 }}>
                  Add New Product to Catalog
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ fontSize: '0.86rem', fontWeight: 600, color: '#3A2E32' }}>Product Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pink Teddy Plushie"
                      value={newProd.name}
                      onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid #F4C4D0',
                        backgroundColor: '#FFF8F9',
                        marginTop: '4px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.86rem', fontWeight: 600, color: '#3A2E32' }}>Category *</label>
                    <select
                      value={newProd.category}
                      onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid #F4C4D0',
                        backgroundColor: '#FFF8F9',
                        marginTop: '4px',
                        outline: 'none'
                      }}
                    >
                      {categories.filter(c => c.slug !== 'all').map(c => (
                        <option key={c.slug} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ fontSize: '0.86rem', fontWeight: 600, color: '#3A2E32' }}>Price (Rs.) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 1299"
                      value={newProd.price}
                      onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid #F4C4D0',
                        backgroundColor: '#FFF8F9',
                        marginTop: '4px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.86rem', fontWeight: 600, color: '#3A2E32' }}>Original Price (Optional)</label>
                    <input
                      type="number"
                      placeholder="e.g. 1499"
                      value={newProd.originalPrice}
                      onChange={(e) => setNewProd({ ...newProd, originalPrice: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid #F4C4D0',
                        backgroundColor: '#FFF8F9',
                        marginTop: '4px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.86rem', fontWeight: 600, color: '#3A2E32' }}>Product Description *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Write description of the handmade product..."
                    value={newProd.description}
                    onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1px solid #F4C4D0',
                      backgroundColor: '#FFF8F9',
                      marginTop: '4px',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Image Upload Field */}
                <div>
                  <label style={{ fontSize: '0.86rem', fontWeight: 600, color: '#3A2E32' }}>Upload Product Image *</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '6px' }}>
                    <label style={{
                      backgroundColor: '#FFF0F3',
                      color: '#8C3149',
                      border: '1px solid #F4C4D0',
                      borderRadius: '9999px',
                      padding: '10px 22px',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <Upload size={16} />
                      <span>{uploadingImage ? 'Uploading Image...' : 'Choose Image File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                      />
                    </label>

                    {newProd.image && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#8C3149', fontWeight: 600 }}>
                        <Check size={16} />
                        <span>Image Uploaded!</span>
                      </div>
                    )}
                  </div>

                  {(imagePreview || newProd.image) && (
                    <div style={{ marginTop: '14px' }}>
                      <img
                        src={newProd.image || imagePreview}
                        alt="Preview"
                        style={{ width: '100px', height: '100px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #F4C4D0' }}
                      />
                    </div>
                  )}
                </div>

                {/* Dynamic Specifications */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label style={{ fontSize: '0.86rem', fontWeight: 600, color: '#3A2E32' }}>Specifications</label>
                    <button
                      type="button"
                      onClick={handleAddSpec}
                      style={{ fontSize: '0.82rem', color: '#8C3149', fontWeight: 600 }}
                    >
                      + Add Detail Pair
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {newProd.specifications.map((spec, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <input
                          type="text"
                          placeholder="Label (e.g. Materials)"
                          value={spec.label}
                          onChange={(e) => handleUpdateSpec(idx, 'label', e.target.value)}
                          style={{ flex: '1', padding: '10px 14px', borderRadius: '8px', border: '1px solid #F4C4D0', fontSize: '0.88rem' }}
                        />
                        <input
                          type="text"
                          placeholder="Value (e.g. 100% Cotton)"
                          value={spec.value}
                          onChange={(e) => handleUpdateSpec(idx, 'value', e.target.value)}
                          style={{ flex: '2', padding: '10px 14px', borderRadius: '8px', border: '1px solid #F4C4D0', fontSize: '0.88rem' }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSpec(idx)}
                          style={{ color: '#991B1B', padding: '6px' }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submittingProduct || uploadingImage}
                  className="btn-primary"
                  style={{ padding: '14px', fontSize: '1.05rem', marginTop: '10px' }}
                >
                  {submittingProduct ? 'Saving Product...' : 'Publish Product to Catalog'}
                </button>
              </form>
            )}

            {/* TAB 3: MANAGE CATEGORIES */}
            {activeTab === 'categories' && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#5C2232', marginBottom: '20px' }}>
                  Catalog Categories
                </h3>

                {/* Add Category Form */}
                <form onSubmit={handleCreateCategory} style={{ display: 'flex', gap: '12px', marginBottom: '28px' }}>
                  <input
                    type="text"
                    placeholder="New category name..."
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    required
                    style={{
                      flexGrow: 1,
                      padding: '12px 18px',
                      borderRadius: '9999px',
                      border: '1px solid #F4C4D0',
                      backgroundColor: '#FFF8F9',
                      outline: 'none',
                      fontSize: '0.95rem'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={submittingCat}
                    className="btn-primary"
                    style={{ padding: '12px 24px', fontSize: '0.92rem' }}
                  >
                    <Plus size={16} />
                    <span>Add Category</span>
                  </button>
                </form>

                {/* Category List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {categories.map(cat => (
                    <div
                      key={cat.slug}
                      style={{
                        backgroundColor: '#FFF8F9',
                        borderRadius: '12px',
                        border: '1px solid #F4C4D0',
                        padding: '14px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: 700, color: '#5C2232', fontSize: '1rem' }}>{cat.name}</span>
                        <span style={{ fontSize: '0.82rem', color: '#6E5C62', marginLeft: '12px' }}>({cat.count} items)</span>
                      </div>

                      {cat.slug.toLowerCase() !== 'all' && (
                        <button
                          onClick={() => handleDeleteCategory(cat.slug, cat.name)}
                          style={{
                            backgroundColor: '#FEF2F2',
                            color: '#991B1B',
                            border: '1px solid #FCA5A5',
                            borderRadius: '9999px',
                            padding: '6px 14px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Trash2 size={13} />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
