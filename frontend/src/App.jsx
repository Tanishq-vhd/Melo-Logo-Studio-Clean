import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

// Pages
import Home from "./Pages/Home";
import Melostudio from "./Pages/Melostudio";
import Maxx from "./Pages/Maxx";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import Payment from "./Pages/Payment";
import Success from "./Pages/Success";
import Privacy from "./Pages/Privacy";
import TermsOfUse from "./Pages/TermsOfUse";
import AboutUs from "./Pages/AboutUs";

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
