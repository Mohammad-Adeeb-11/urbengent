import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeaturedProducts from "./components/FeaturedProducts";
import Footer from "./components/Footer";

import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import Welcome from "./pages/Welcome";
import About from "./pages/About";
import Wishlist from "./pages/Wishlist";
import Shop from "./pages/Shop";
// import Profile from "./pages/Profile";
import Account from "./pages/Account";
import Profile from "./pages/account/Profile";
import Orders from "./pages/account/Orders";
import WishlistPage from "./pages/account/Wishlist";
import Addresses from "./pages/account/Addresses";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminProducts from "./admin/AdminProducts";
import AdminCreateProduct from "./admin/AdminCreateProduct";
import AdminEditProduct from "./admin/AdminEditProduct";
import AdminUsers from "./admin/AdminUsers";

function App() {
  return (
    <Router>
      <div className="bg-white min-h-screen flex flex-col">
        {/* Top strip */}
        <div className="bg-[#2E4A7D] text-white text-sm text-center py-2">
          Free Shipping on Orders Above ₹1999
        </div>

        <Navbar />

        <div className="flex-grow">
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route
              path="/"
              element={
                <>
                  <Hero />
                  <FeaturedProducts />
                </>
              }
            />

            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/shop" element={<Shop />} />

            {/* AUTH ROUTES */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify" element={<VerifyOtp />} />
            <Route path="/welcome" element={<Welcome />} />

            {/* USER PROTECTED */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              }
            >
              <Route path="profile" element={<Profile />} />
              <Route path="orders" element={<Orders />} />
              <Route path="wishlist" element={<WishlistPage />} />
              <Route path="addresses" element={<Addresses />} />
            </Route>

            {/* ADMIN ROUTES */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="create-product" element={<AdminCreateProduct />} />
              <Route path="product/:id/edit" element={<AdminEditProduct />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
