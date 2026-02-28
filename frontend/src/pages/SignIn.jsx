import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import logo from "../assets/images/logo.jpg";

import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";

export default function SignIn() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = "https://melo-logo-studio.onrender.com";

  // 🔥 Check Premium Status
  const checkPaymentAndNavigate = useCallback(async (email, token) => {
    try {
      const res = await fetch(`${API_URL}/api/payment/check-status/${email}`);
      const data = await res.json();

      const isPaid = data.success ? data.isPremium : false;

      localStorage.setItem("user", JSON.stringify({ email, isPaid }));
      localStorage.setItem("token", token);

      if (isPaid) {
        navigate("/payment-success"); // 🔥 Directly go to success
      } else {
        navigate("/payment");
      }
    } catch (err) {
      console.error("Status check failed:", err);
      navigate("/payment");
    }
  }, [navigate]);

  useEffect(() => {
    getRedirectResult(auth)
      .then(async (result) => {
        if (!result) return;
        const user = result.user;
        const idToken = await user.getIdToken();
        await checkPaymentAndNavigate(user.email, idToken);
      })
      .catch((err) => {
        console.error("Redirect error:", err);
        setError(err.message);
      });
  }, [checkPaymentAndNavigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser(form);
      if (res.token) {
        await checkPaymentAndNavigate(res.user?.email, res.token);
      } else {
        setError(res.message || "Login failed");
      }
    } catch (err) {
      setError("Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      await checkPaymentAndNavigate(result.user.email, idToken);
    } catch (err) {
      if (err.code === "auth/popup-blocked") {
        await signInWithRedirect(auth, googleProvider);
      } else {
        setError(err.message);
        setLoading(false);
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <img src={logo} alt="Melo Logo Studio" className="auth-logo-img" />
        <h1>Sign in</h1>

        <button
          type="button"
          className="google-btn"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          Continue with Google
        </button>

        <div className="auth-divider"><span>or</span></div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {error && <p className="auth-error">{error}</p>}

        <p className="auth-footer">
          Don’t have an account? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
}