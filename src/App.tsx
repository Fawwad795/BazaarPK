import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import BuyerDashboardPage from './pages/BuyerDashboardPage';
import BuyerAccountPage from './pages/BuyerAccountPage';
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
import { useAuthStore } from './store/authStore';

function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<BuyerDashboardPage />} />
          <Route path="/account" element={<BuyerAccountPage />} />
          <Route path="/products" element={<ProductListingPage />} />
          <Route path="/products/new" element={<AddProductPage />} />
          <Route path="/products/:productId" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<BuyerOrdersPage />} />
          <Route path="/tracking" element={<TrackingPage />} />
          <Route path="/disputes" element={<DisputePage />} />
          <Route path="/seller/onboarding" element={<SellerOnboardingPage />} />
          <Route path="/dashboard" element={<SellerDashboardPage />} />
          <Route path="/dashboard/orders" element={<SellerOrdersPage />} />
          <Route path="/dashboard/orders/:orderId" element={<SellerOrderDetailsPage />} />
          <Route path="/dashboard/analytics" element={<SellerAnalyticsPage />} />
          <Route path="/dashboard/payments" element={<SellerPaymentsPage />} />
          <Route path="/admin" element={<AdminPanelPage />} />
          <Route path="/admin/seller-verification" element={<AdminSellerVerificationPage />} />
          <Route path="/admin/disputes" element={<AdminDisputeManagementPage />} />
          <Route path="/admin/analytics" element={<AdminPlatformAnalyticsPage />} />
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
