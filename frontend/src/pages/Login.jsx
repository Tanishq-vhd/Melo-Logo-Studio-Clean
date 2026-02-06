import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser(form);

      // ✅ success case
      if (res && res.token) {
        localStorage.setItem("token", res.token);
        navigate("/success");
        return;
      }

      // ✅ handled backend errors (401, 400)
      setError(res?.message || "Invalid email or password");
    } catch (err) {
      // ✅ network / unexpected error
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">✨</div>

        <h1>Welcome back</h1>
        <p className="auth-subtext">
          Sign in to continue creating logos
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Your password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {error && (
          <p style={{ color: "red", marginTop: "10px" }}>
            {error}
          </p>
        )}

        <p className="auth-footer">
          Don’t have an account?{" "}
          <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  );
}
