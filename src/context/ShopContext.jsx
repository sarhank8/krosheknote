import React, { createContext, useContext, useState, useEffect } from 'react';

const ShopContext = createContext();

export const WHATSAPP_NUMBER = '918487993896';

export const generateWhatsAppLink = (product, quantity = 1, customNote = '') => {
  const photoUrl = product.image.startsWith('http')
    ? product.image
    : `${window.location.origin}${product.image}`;

  let specsText = '';
  if (product.specifications && product.specifications.length > 0) {
    specsText = product.specifications
      .map(s => `- ${s.label}: ${s.value}`)
      .join('\n');
  }

  const message = `Hello krosheknote!

I would like to inquire about ordering this product:

Product Name: ${product.name}
Price: Rs. ${(product.price * quantity).toLocaleString('en-IN')}${quantity > 1 ? ` (Quantity: ${quantity})` : ''}
Category: ${product.category}
Description: ${product.description}

${specsText ? `Specifications:\n${specsText}\n` : ''}
Product Photo: ${photoUrl}

${customNote ? `My Note: ${customNote}\n` : ''}Please share availability, shipping timeline, and payment details.`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

export const generateGeneralWhatsAppLink = (text = 'Hello krosheknote! I would like to inquire about your handmade crochet catalog.') => {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
};

export const ShopProvider = ({ children }) => {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'shop' | 'product-detail'
  const [selectedProductSlug, setSelectedProductSlug] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Global Catalog State synchronized between Admin and Customer Site
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);

  // Wishlist State (persisted in localStorage)
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('krn_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [toast, setToast] = useState(null);

  // Fetch / Refresh global catalog data from backend API
  const refreshCatalog = async () => {
    try {
      const [pRes, cRes] = await Promise.all([
        fetch('/api/products').then(res => res.json()),
        fetch('/api/categories').then(res => res.json())
      ]);

      if (pRes.success) setProducts(pRes.products);
      if (cRes.success) setCategories(cRes.categories);
    } catch (err) {
      console.error('Error fetching catalog data:', err);
    } finally {
      setLoadingCatalog(false);
    }
  };

  useEffect(() => {
    refreshCatalog();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('krn_wishlist', JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const openWhatsAppInquiry = (product, quantity = 1, customNote = '') => {
    const link = generateWhatsAppLink(product, quantity, customNote);
    showToast(`Opening WhatsApp chat for "${product.name}"...`);
    window.open(link, '_blank');
  };

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        showToast(`Removed "${product.name}" from wishlist`);
        return prev.filter(item => item.id !== product.id);
      } else {
        showToast(`Saved "${product.name}" to wishlist`);
        return [...prev, product];
      }
    });
  };

  const goToProductDetail = (slug) => {
    setSelectedProductSlug(slug);
    setCurrentView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToShop = (category = 'all') => {
    setSelectedCategory(category);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToHome = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ShopContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedProductSlug,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        products,
        categories,
        loadingCatalog,
        refreshCatalog,
        wishlist,
        toast,
        showToast,
        openWhatsAppInquiry,
        toggleWishlist,
        goToProductDetail,
        goToShop,
        goToHome
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
