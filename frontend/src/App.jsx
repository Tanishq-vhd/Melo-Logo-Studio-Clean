import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

// Lazy loading pages - Ensure these filenames match your folder exactly (Case Sensitive!)
const Home = lazy(() => import("./pages/Home"));
const Melostudio = lazy(() => import("./pages/Melostudio"));
const Maxx = lazy(() => import("./pages/Maxx"));
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Payment = lazy(() => import("./pages/Payment"));
const Success = lazy(() => import("./pages/Success"));
const Privacy = lazy(() => import("./pages/Privacy"));
const TermsOfUse = lazy(() => import("./pages/TermsOfUse"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const BeautyBrand = lazy(() => import("./pages/BeautyBrand"));
const Fashion = lazy(() => import("./pages/Fashion"));
const Bakery = lazy(() => import("./pages/Bakery"));
const Jewellery = lazy(() => import("./pages/Jewellery"));
const FoodBrand = lazy(() => import("./pages/FoodBrand"));
const Skincare = lazy(() => import("./pages/Skincare"));

/* 🔐 Auth Wrappers */
const RequireAuth = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/signin" replace />;
  return children;
};

const RequirePayment = ({ children }) => {
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  // Use optional chaining to prevent crashes if user is null
  if (!user?.isPaid) return <Navigate to="/payment" replace />;
  return children;
};

const Loader = () => <div style={{ padding: "50px", textAlign: "center" }}>Loading...</div>;

function App() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* 🌍 Public Category Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/beauty-brand" element={<BeautyBrand />} />
          <Route path="/fashion" element={<Fashion />} />
          <Route path="/bakery" element={<Bakery />} />
          <Route path="/jewellery" element={<Jewellery />} />
          <Route path="/food-brand" element={<FoodBrand />} />
          <Route path="/skincare" element={<Skincare />} />
          
          {/* 📄 Legal & Info */}
          <Route path="/privacy-policy" element={<Privacy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="/about" element={<AboutUs />} />

          {/* 🔓 Auth */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* 💳 Protected Premium Routes */}
          <Route path="/payment" element={<RequireAuth><Payment /></RequireAuth>} />
          <Route path="/maxx" element={<RequireAuth><RequirePayment><Maxx /></RequirePayment></RequireAuth>} />
          <Route path="/melostudio" element={<RequireAuth><RequirePayment><Melostudio /></RequirePayment></RequireAuth>} />
          <Route path="/success" element={<RequireAuth><RequirePayment><Success /></RequirePayment></RequireAuth>} />

          {/* 🔁 Redirect any unknown routes to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;