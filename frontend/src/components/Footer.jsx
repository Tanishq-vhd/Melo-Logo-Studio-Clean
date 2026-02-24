import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <p>© 2026 InstaLogo Studio. Professional logos for creators.</p>

      <div className="footer-links">
        <Link to="/privacy-policy">Privacy Policy</Link>
        <Link to="/terms-of-use">Terms of Use</Link>
        <Link to="/about">About Us</Link>
      </div>
    </footer>
  );
}
