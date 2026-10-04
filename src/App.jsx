import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { AdminPanel } from './pages/AdminPanel';

const MainContent = () => {
  const { currentView } = useShop();
  const isAdminPath = window.location.pathname.startsWith('/admin');

  if (isAdminPath) {
    return (
      <div style={{ minHeight: '100vh' }}>
        <AdminPanel />
        <Toast />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flexGrow: 1 }}>
        {currentView === 'home' && <Home />}
        {currentView === 'shop' && <Shop />}
        {currentView === 'product-detail' && <ProductDetail />}
      </main>

      <Footer />
      <Toast />
    </div>
  );
};

export function App() {
  return (
    <ShopProvider>
      <MainContent />
    </ShopProvider>
  );
}

export default App;
