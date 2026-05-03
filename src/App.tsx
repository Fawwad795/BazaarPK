import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import BuyerAccountPage from './pages/BuyerAccountPage';
import BuyerDashboardPage from './pages/BuyerDashboardPage';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AddProductPage from './pages/AddProductPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import SellerDashboardPage from './pages/SellerDashboardPage';
import AdminPanelPage from './pages/AdminPanelPage';
import AdminSellerVerificationPage from './pages/AdminSellerVerificationPage';
import AdminDisputeManagementPage from './pages/AdminDisputeManagementPage';
import AdminPlatformAnalyticsPage from './pages/AdminPlatformAnalyticsPage';
import BuyerOrdersPage from './pages/BuyerOrdersPage';
import SellerOrdersPage from './pages/SellerOrdersPage';
import SellerOrderDetailsPage from './pages/SellerOrderDetailsPage';
import SellerAnalyticsPage from './pages/SellerAnalyticsPage';
import SellerPaymentsPage from './pages/SellerPaymentsPage';
import SellerOnboardingPage from './pages/SellerOnboardingPage';
import CheckoutPage from './pages/CheckoutPage';
import TrackingPage from './pages/TrackingPage';
import DisputePage from './pages/DisputePage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthStore } from './store/authStore';

function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Buyer routes */}
          <Route path="/buyer" element={<ProtectedRoute allowedRoles={['buyer']}><BuyerDashboardPage /></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute allowedRoles={['buyer']}><BuyerAccountPage /></ProtectedRoute>} />
          <Route path="/products" element={<ProtectedRoute allowedRoles={['buyer']}><ProductListingPage /></ProtectedRoute>} />
          <Route path="/products/:productId" element={<ProtectedRoute allowedRoles={['buyer']}><ProductDetailPage /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute allowedRoles={['buyer']}><CartPage /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute allowedRoles={['buyer']}><CheckoutPage /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute allowedRoles={['buyer']}><BuyerOrdersPage /></ProtectedRoute>} />
          <Route path="/tracking" element={<ProtectedRoute allowedRoles={['buyer']}><TrackingPage /></ProtectedRoute>} />
          <Route path="/disputes" element={<ProtectedRoute allowedRoles={['buyer']}><DisputePage /></ProtectedRoute>} />

          {/* Seller routes */}
          <Route path="/seller/onboarding" element={<ProtectedRoute allowedRoles={['seller']}><SellerOnboardingPage /></ProtectedRoute>} />
          <Route path="/products/new" element={<ProtectedRoute allowedRoles={['seller']}><AddProductPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['seller']}><SellerDashboardPage /></ProtectedRoute>} />
          <Route path="/dashboard/orders" element={<ProtectedRoute allowedRoles={['seller']}><SellerOrdersPage /></ProtectedRoute>} />
          <Route path="/dashboard/orders/:orderId" element={<ProtectedRoute allowedRoles={['seller']}><SellerOrderDetailsPage /></ProtectedRoute>} />
          <Route path="/dashboard/analytics" element={<ProtectedRoute allowedRoles={['seller']}><SellerAnalyticsPage /></ProtectedRoute>} />
          <Route path="/dashboard/payments" element={<ProtectedRoute allowedRoles={['seller']}><SellerPaymentsPage /></ProtectedRoute>} />

          {/* Admin routes */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminPanelPage /></ProtectedRoute>} />
          <Route path="/admin/seller-verification" element={<ProtectedRoute allowedRoles={['admin']}><AdminSellerVerificationPage /></ProtectedRoute>} />
          <Route path="/admin/disputes" element={<ProtectedRoute allowedRoles={['admin']}><AdminDisputeManagementPage /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['admin']}><AdminPlatformAnalyticsPage /></ProtectedRoute>} />

          {/* Catch-all: redirect unknown routes to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function ScrollToTopOnRouteChange() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}

export default function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <BrowserRouter>
      <ScrollToTopOnRouteChange />
      <AppLayout />
    </BrowserRouter>
  );
}
