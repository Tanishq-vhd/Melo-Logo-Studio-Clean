import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/images/logo.jpg";
 

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isPaid");
    navigate("/signin");
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        
        {/* 🔥 BRAND LOGO + NAME */}
        <Link to="/" className="logo">
          <img
            src={logo}
            alt="melo"
            className="brand-logo"
          />
          <span className="brand-name">melo</span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/melostudio">melostudio</NavLink>
          <NavLink to="/Maxx">Maxx</NavLink>
        </nav>

        <div className="auth-buttons">
          {!token ? (
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
