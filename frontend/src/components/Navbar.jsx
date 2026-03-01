import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import "./Navbar.css";
import logo from "../assets/images/logo.jpg";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/signin");
  };

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="logo">
          <img src={logo} alt="melo" className="brand-logo" />
          <span className="brand-name">melo</span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/melostudio">melostudio</NavLink>
          <NavLink to="/maxx">Maxx</NavLink>
        </nav>

        <div className="auth-buttons">
          {!user ? (
            <>
              <Link to="/signin" className="signin">Sign In</Link>
              <Link to="/signup" className="signup">Sign Up</Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="signup"
              style={{ border: "none", cursor: "pointer" }}
            >
              Logout
            </button>
          )}
        </div>

      </div>
    </header>
  );
}