import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import Melostudio from "./pages/Melostudio";
import Maxx from "./pages/Maxx";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Payment from "./pages/Payment";
import Success from "./pages/Success";
import Privacy from "./pages/Privacy";
import TermsOfUse from "./pages/TermsOfUse";
import AboutUs from "./pages/AboutUs";

/* 🔐 Login required */
const RequireAuth = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

/* 💳 Premium required */
const RequirePayment = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.isPaid) {
    return <Navigate to="/payment" replace />;
  }

  return children;
};

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* 🌍 Public */}
        <Route path="/" element={<Home />} />
        <Route path="/privacy-policy" element={<Privacy />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
        <Route path="/about" element={<AboutUs />} />

        {/* 🔓 Auth */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* 💳 Payment (login required) */}
        <Route
          path="/payment"
          element={
            <RequireAuth>
              <Payment />
            </RequireAuth>
          }
        />

        {/* 🔒 Premium Protected Pages */}
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
      {
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
      }
       
      <Route path="/melostudio" element={<Melostudio />} />

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

        {/* 🔁 Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
  