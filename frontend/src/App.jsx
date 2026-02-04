import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import Melostudio from "./pages/Melostudio";
import Maxx from "./pages/Maxx";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Payment from "./pages/payment";
import Success from "./pages/success";

/* 🔐 Login required */
const RequireAuth = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/signup" replace />;
};

/* 💳 Payment required */
const RequirePayment = ({ children }) => {
  const isPaid = localStorage.getItem("isPaid");
  return isPaid === "true" ? children : <Navigate to="/payment" replace />;
};

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* 🌍 Public landing page */}
        <Route path="/" element={<Home />} />

        {/* 🔓 Auth pages */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* 💳 Pricing → payment enforced */}
       <Route path="/maxx" element={<Maxx />} />


        {/* 💳 Payment page (login required only) */}
        <Route
          path="/payment"
          element={
            <RequireAuth>
              <Payment />
            </RequireAuth>
          }
        />

        {/* ✅ Success */}
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

        {/* 🔒 AI Tools */}
        <Route
          path="/Melostudio"
          element={
            <RequireAuth>
              <RequirePayment>
                <Melostudio />
              </RequirePayment>
            </RequireAuth>
          }
        />

        {/*  Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
