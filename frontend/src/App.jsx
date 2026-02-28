import "./firebase";
import React, { Suspense, lazy, useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./firebase";
import Navbar from "./components/Navbar";

/* ================= Lazy Pages ================= */
const Home = lazy(() => import("./pages/Home"));
const Melostudio = lazy(() => import("./pages/Melostudio"));
const Maxx = lazy(() => import("./pages/Maxx"));
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Payment = lazy(() => import("./pages/Payment"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
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
const Tech = lazy(() => import("./pages/Tech"));
const PetSupplies = lazy(() => import("./pages/PetSupplies"));

/* ================= AUTH PROTECTION ================= */
const RequireAuth = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setAuthenticated(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div style={{ padding: 40 }}>Checking authentication...</div>;

  return authenticated ? children : <Navigate to="/signin" replace />;
};

/* ================= PREMIUM PROTECTION ================= */
const RequirePayment = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `https://melo-logo-studio.onrender.com/api/payment/check-status/${user.email}`
        );

        const data = await res.json();

        if (data.success && data.isPremium) {
          setIsPremium(true);
        } else {
          setIsPremium(false);
        }
      } catch (err) {
        console.error("Premium check failed", err);
        setIsPremium(false);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div style={{ padding: 40 }}>Checking subscription...</div>;

  return isPremium ? children : <Navigate to="/payment" replace />;
};

/* ================= LOADER ================= */
const Loader = () => (
  <div style={{ padding: 100, textAlign: "center", color: "#ff4d94" }}>
    Loading Component...
  </div>
);

/* ================= MAIN APP ================= */
function App() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<Loader />}>
        <Routes>

          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/beauty-brand" element={<BeautyBrand />} />
          <Route path="/fashion" element={<Fashion />} />
          <Route path="/bakery" element={<Bakery />} />
          <Route path="/jewellery" element={<Jewellery />} />
          <Route path="/food-brand" element={<FoodBrand />} />
          <Route path="/skincare" element={<Skincare />} />
          <Route path="/tech" element={<Tech />} />
          <Route path="/pet-supplies" element={<PetSupplies />} />
          <Route path="/privacy-policy" element={<Privacy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="/about" element={<AboutUs />} />

          {/* Auth */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Payment */}
          <Route
            path="/payment"
            element={
              <RequireAuth>
                <Payment />
              </RequireAuth>
            }
          />

          <Route
            path="/payment-success"
            element={
              <RequireAuth>
                <PaymentSuccess />
              </RequireAuth>
            }
          />

          {/* Premium */}
          <Route
            path="/melostudio"
            element={
              <RequireAuth>
                <RequirePayment>
                  <Melostudio />
                </RequirePayment>
              </RequireAuth>
            }
          />

          <Route
            path="/maxx"
            element={
              <RequireAuth>
                <RequirePayment>
                  <Maxx />
                </RequirePayment>
              </RequireAuth>
            }
          />

          <Route
            path="/success"
            element={
              <RequireAuth>
                <RequirePayment>
                  <Success />
                </RequirePayment>
              </RequireAuth>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Suspense>
    </>
  );
}

export default App;