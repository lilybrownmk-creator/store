import React, { useEffect } from 'react' 
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { queryClient } from '@/lib/queryClient'
import { LanguageProvider } from '@/lib/i18n'
import ReactPixel from 'react-facebook-pixel' // Го додаваме пакетот за Pixel

import Shop              from '@/pages/Shop'
import Wishlist          from '@/pages/Wishlist'
import BundleBuilder     from '@/pages/BundleBuilder'
import MyOrders          from '@/pages/MyOrders'
import Admin             from '@/pages/Admin'
import AdminLogin        from '@/pages/AdminLogin'
import AdminGuard        from '@/components/AdminGuard'
import OrderConfirmation from '@/pages/OrderConfirmation'
import ProductDetail from '@/pages/ProductDetail'

// Оваа компонента ги следи промените на линковите во прелистувачот (/wishlist, /orders...)
function PixelTracker() {
  const location = useLocation();

  useEffect(() => {
    // Секој пат кога корисникот ќе смени страница, му јавуваме на Meta
    ReactPixel.pageView();
  }, [location]);

  return null;
}

export default function App() {
  // Го активираме Pixel-от со твојот точен број веднаш штом ќе се вчита сајтот
  useEffect(() => {
    ReactPixel.init('266319177839439'); // Твојот точен број е веќе тука
    ReactPixel.pageView();
  }, []);

  return (
    <LanguageProvider>
    <QueryClientProvider client={queryClient}>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        {/* Го ставаме следачот внатре во Router */}
        <PixelTracker />

        <Routes>
          {/* ── Storefront ── */}
          <Route path="/"          element={<Shop />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/bundle"   element={<BundleBuilder />} />
          <Route path="/orders"   element={<MyOrders />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          
          {/* ── Admin ── */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <AdminGuard>
                <Admin />
              </AdminGuard>
            }
          />

          {/* ── Fallback ── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster position="bottom-right" richColors duration={1800} />
    </QueryClientProvider>
    </LanguageProvider>
  )
}
