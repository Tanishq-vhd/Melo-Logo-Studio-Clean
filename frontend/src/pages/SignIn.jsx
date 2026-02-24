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
        
        // Default for new social sign-ins, though your backend 
        // should ideally provide the real status here.
        const userData = { email: user.email, isPremium: false };
        localStorage.setItem("user", JSON.stringify(userData));

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
        // 1. Save Token
        localStorage.setItem("token", res.token);

        // 2. Save User Object with isPremium field
        // Ensure your backend login API returns 'isPremium' and 'user' object
        const userData = {
          _id: res.user?._id,
          email: res.user?.email,
          isPremium: res.user?.isPremium || false // Match MongoDB field
        };
        localStorage.setItem("user", JSON.stringify(userData));

        // 3. Smart Redirect: If premium, go to studio. If not, go to home/payment.
        if (userData.isPremium) {
          navigate("/melostudio");
        } else {
          navigate("/");
        }
      } else {
        setError(res.message || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
      GOOGLE SIGN IN
  ================================ */
  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

      localStorage.setItem("token", idToken);
      
      // Note: For Google Sign-in, you should ideally call your backend 
      // to check if this Google user is already premium in your DB.
      localStorage.setItem("user", JSON.stringify({ email: user.email, isPremium: false }));

      navigate("/payment");
    } catch (err) {
      if (err.code === "auth/popup-blocked" || err.code === "auth/cancelled-popup-request") {
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

        <button type="button" className="google-btn" onClick={handleGoogleSignIn} disabled={loading}>
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
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