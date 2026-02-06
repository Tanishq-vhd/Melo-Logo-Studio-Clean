import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import logo from "../assets/images/logo.jpg";

// 🔥 Firebase
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

  /* ===============================
     HANDLE REDIRECT RESULT
  ================================ */
  useEffect(() => {
    getRedirectResult(auth)
      .then(async (result) => {
        if (!result) return;

        const user = result.user;
        const idToken = await user.getIdToken();

        localStorage.setItem("token", idToken);
        localStorage.setItem("isPaid", "false");

        navigate("/payment");
      })
      .catch((err) => {
        console.error("Redirect error:", err);
        setError(err.message);
      });
  }, [navigate]);

  /* ===============================
     EMAIL / PASSWORD LOGIN
  ================================ */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser(form);
      if (res.token) {
        localStorage.setItem("token", res.token);
        navigate("/ai-tools");
      } else {
        setError(res.message || "Login failed");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     GOOGLE SIGN IN (ROBUST)
  ================================ */
  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);

    try {
      // 1️⃣ Try popup
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

      localStorage.setItem("token", idToken);
      localStorage.setItem("isPaid", "false");

      navigate("/payment");
    } catch (err) {
      console.warn("Popup failed, trying redirect:", err.code);

      // 2️⃣ Popup blocked → fallback to redirect
      if (
        err.code === "auth/popup-blocked" ||
        err.code === "auth/cancelled-popup-request"
      ) {
        await signInWithRedirect(auth, googleProvider);
      } else {
        console.error("Google sign-in error:", err);
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

        {/* GOOGLE SIGN IN */}
        <button
          type="button"
          className="google-btn"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
          />
          Continue with Google
        </button>

        <div className="auth-divider">
          <span>or</span>
        </div>

        {/* EMAIL LOGIN */}
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

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
