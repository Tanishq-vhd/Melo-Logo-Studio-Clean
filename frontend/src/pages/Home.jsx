import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Explore.css";

import beauty from "../assets/images/Beauty.jpg";
import fashion from "../assets/images/Fashion.jpg";
import Bakery from "../assets/images/Bakery.jpg";
import Jewellery from "../assets/images/Jewellery.jpg";
import tech from "../assets/images/tech.jpg";
import food from "../assets/images/Food.jpg";
import skincare from "../assets/images/skincare.jpg";
import petsupplies from "../assets/images/petsupplies.jpg";

/* AUTO PROMPTS */
const prompts = [
  "A minimal pink logo for a beauty brand",
  "Luxury gold jewellery branding",
  "Modern tech startup logo",
  "Instagram fitness flyer design",
  "Elegant bakery pastel logo",
];

/* LOGOS */
const logos = [
  { title: "Beauty Brand", img: beauty },
  { title: "Fashion Store", img: fashion },
  { title: "Bakery", img: Bakery },
  { title: "Jewellery", img: Jewellery },
  { title: "Tech Startup", img: tech },
  { title: "Food Brand", img: food },
  { title: "Skincare", img: skincare },
  { title: "Pet Supplies", img: petsupplies },
];

export default function Home() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  /* Rotating placeholder */
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) =>
        prev === prompts.length - 1 ? 0 : prev + 1
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  /* Scroll button visibility */
  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* Plus click logic */
  const handlePlusClick = () => {
    const isPaid = localStorage.getItem("isPaid");

    if (isPaid === "true") {
      fileInputRef.current.click();
    } else {
      navigate("/signup");
    }
  };

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero">
        <h1>
          Create a logo that helps you{" "}
          <span className="pink">sell more</span> on Instagram
        </h1>

        <p>
          Professional AI-powered logos designed for creators and modern brands.
        </p>

        {/* SEARCH BAR */}
        <div className="search-container">
          <input
            type="text"
            placeholder={prompts[placeholderIndex]}
            className="hero-input"
          />

          <button className="plus-btn" onClick={handlePlusClick}>
            +
          </button>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
          />
        </div>

        <button
          className="primary-cta"
          onClick={() => navigate("/signup")}
        >
          Generate my logo
        </button>
      </section>

      {/* EXPLORE SECTION */}
      <section className="explore-page">
        <h1>Explore AI-Generated Logos</h1>

        <div className="logo-grid">
          {logos.map((item, index) => (
            <div className="logo-card" key={index}>
              <img src={item.img} alt={item.title} />
              <p>{item.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="free-ai">
        <div className="stars">★★★★★</div>
        <p className="trusted">Trusted by over 20M+ users</p>

        <h2>Free Online AI Designers</h2>

        <p className="desc">
          Watch your ideas transform into stunning designs that help your
          projects stand out.
        </p>

        <button
          className="black-cta"
          onClick={() => navigate("/signup")}
        >
          CREATE NOW
        </button>

        <div className="footer-links">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-of-use">Terms of Use</Link>
          <Link to="/about">About Us</Link>
        </div>
      </section>

      {/* SCROLL TO TOP */}
      {showScrollTop && (
        <button className="scroll-top-btn" onClick={scrollToTop}>
          ↑
        </button>
      )}
    </>
  );
}
