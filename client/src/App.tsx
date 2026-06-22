import { useEffect, type ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/components/auth-provider";
import { CartProvider } from "@/components/cart";
import { Loading } from "@/components/loading";

import HomePage from "@/pages/HomePage";
import GalleryPage from "@/pages/GalleryPage";
import CollectionsPage from "@/pages/CollectionsPage";
import CommissionPage from "@/pages/CommissionPage";
import CheckoutPage from "@/pages/CheckoutPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ProfilePage from "@/pages/ProfilePage";
import NotFound from "@/pages/NotFound";

import AdminLayout from "@/pages/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminArtworks from "@/pages/admin/AdminArtworks";
import AdminCollections from "@/pages/admin/AdminCollections";
import AdminProcess from "@/pages/admin/AdminProcess";
import AdminTestimonials from "@/pages/admin/AdminTestimonials";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminCommission from "@/pages/admin/AdminCommission";
import AdminMedia from "@/pages/admin/AdminMedia";

/** Scrolls to a #hash target on navigation, or to the top otherwise. */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      // Element may not exist yet while a page is fetching; retry briefly.
      let tries = 0;
      const tryScroll = () => {
        const el = document.getElementById(hash.slice(1));
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        } else if (tries++ < 10) {
          setTimeout(tryScroll, 100);
        }
      };
      tryScroll();
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  if (!user || user.role !== "admin") return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ScrollManager />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/collections" element={<CollectionsPage />} />
            <Route path="/commission" element={<CommissionPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/checkout" element={<RequireAuth><CheckoutPage /></RequireAuth>} />
            <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />

            <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
              <Route index element={<AdminDashboard />} />
              <Route path="artworks" element={<AdminArtworks />} />
              <Route path="collections" element={<AdminCollections />} />
              <Route path="process" element={<AdminProcess />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="commission" element={<AdminCommission />} />
              <Route path="media" element={<AdminMedia />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
