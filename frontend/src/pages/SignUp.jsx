import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../services/api";
import { auth } from "../firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import logo from "../assets/images/logo.jpg";

export default function SignUp() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= EMAIL SIGNUP ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1️⃣ Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const firebaseUser = userCredential.user;

      // 2️⃣ Send to backend
      const res = await signupUser({
        name: form.name,
        email: form.email,
        password: form.password,
        firebaseUid: firebaseUser.uid,
      });

      if (res?.token) {
        // Save token
        localStorage.setItem("token", res.token);

        // Save full backend user (contains isPremium)
        localStorage.setItem("user", JSON.stringify(res.user));

        // Redirect properly
        if (res.user.isPremium) {
          navigate("/success");
        } else {
          navigate("/payment");
        }
      } else {
        setError(res?.message || "Signup failed");
      }

    } catch (err) {
      console.error("Signup error:", err);
      setError(err?.response?.data?.message || err.message || "Signup failed");
    }

    setLoading(false);
  };

  /* ================= GOOGLE SIGNUP ================= */
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const res = await signupUser({
        name: user.displayName || "Google User",
        email: user.email,
        password: user.uid,
        firebaseUid: user.uid,
      });

      if (res?.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));

        if (res.user.isPremium) {
          navigate("/success");
        } else {
          navigate("/payment");
        }
      } else {
        setError(res?.message || "Google signup failed");
      }

    } catch (error) {
      console.error("Google sign-in error:", error);
      setError(error?.response?.data?.message || error.message || "Google sign-in failed");
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <img src={logo} alt="Melo Logo" className="auth-logo-img" />

        <h1>Create account</h1>

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

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button className="auth-btn" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        {error && <p className="auth-error">{error}</p>}

        <p className="auth-footer">
          Already have an account? <Link to="/signin">Sign in</Link>
        </p>
      </div>
    </div>
  );
}