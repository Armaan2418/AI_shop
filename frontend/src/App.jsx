import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

// Layout
import Navbar        from './components/Navbar';

// Global floating components
import CompareDrawer from './components/CompareDrawer';
import ChatBot       from './components/ChatBot';
import VisualSearch  from './components/VisualSearch';

// Public pages
import Home          from './pages/Home';
import Products      from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Login         from './pages/Login';
import Register      from './pages/Register';
import VerifyEmail   from './pages/Verifyemail';
import Contact       from './pages/Contact';
import About         from './pages/About';
import Wishlist      from './pages/Wishlist';

// Protected pages
import Cart          from './pages/cart';
import Checkout      from './pages/Checkout';
import OrderSuccess  from './pages/OrderSuccess';
import Dashboard     from './pages/Dashboard.jsx';
import OrderTracking from './pages/OrderTracking';

export default function App() {
  return (
    <BrowserRouter>
      {/* Scroll to top on every route change */}
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          {/* Public */}
          <Route path="/"             element={<Home />} />
          <Route path="/products"     element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/login"        element={<Login />} />
          <Route path="/register"     element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/contact"      element={<Contact />} />
          <Route path="/about"        element={<About />} />
          <Route path="/wishlist"     element={<Wishlist />} />

          {/* Public — cart visible to guests */}
          <Route path="/cart" element={<Cart />} />

          {/* Protected — must be logged in */}
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout"             element={<Checkout />} />
            <Route path="/order-success"        element={<OrderSuccess />} />
            <Route path="/dashboard"            element={<Dashboard />} />
            <Route path="/dashboard/orders/:id" element={<OrderTracking />} />
          </Route>
        </Routes>
      </main>

      {/* Global overlays — always mounted */}
      <CompareDrawer />
      <VisualSearch />
      <ChatBot />
    </BrowserRouter>
  );
}