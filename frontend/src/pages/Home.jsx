import { useState, useEffect } from "react";
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

/* FAQ */
const faqs = [
  {
    q: "How does the AI generate designs for logos and other stuff?",
    a: "Our AI uses advanced algorithms and trained datasets to generate unique logos and branding assets based on your input.",
  },
  {
    q: "What file formats are available for downloading the designs?",
    a: "You can download PNG, PDF, and SVG formats depending on your plan.",
  },
  {
    q: "Is there a limit to how many designs I can generate?",
    a: "Free users have limited generations. Premium users get unlimited access.",
  },
  {
    q: "Does the AI generate unique designs, or are they templates?",
    a: "All designs are generated uniquely based on your prompt.",
  },
  {
    q: "How secure is my data on your platform?",
    a: "We follow industry best practices for encryption and data security.",
  },
  {
    q: "Can I use the designs for commercial purposes?",
    a: "Yes. All premium designs include commercial usage rights.",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  /* Scroll-to-top visibility */
  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="hero">
        <h1>
          Create a logo that helps you{" "}
          <span className="pink">sell more</span> on Instagram
        </h1>

        <p>
          Professional AI-powered logos designed for creators and modern brands.
        </p>

        <input placeholder="A minimal pink logo for a beauty brand" />

        <button
          className="primary-cta"
          onClick={() => navigate("/signup")}
        >
          Generate my logo
        </button>
      </section>

      {/* ================= EXPLORE ================= */}
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

      {/* ================= FAQ ================= */}
      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>

        {faqs.map((item, index) => (
          <div className="faq-item" key={index}>
            <div
              className="faq-question"
              onClick={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
            >
              <span>{item.q}</span>
              <span>{openIndex === index ? "⌃" : "⌄"}</span>
            </div>

            {openIndex === index && (
              <p className="faq-answer">{item.a}</p>
            )}
          </div>
        ))}
      </section>

      {/* ================= FREE AI DESIGNERS ================= */}
      <section className="free-ai">
        <div className="stars">★★★★★</div>
        <p className="trusted">Trusted by users</p>

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

      {/* ================= SCROLL TO TOP ================= */}
      {showScrollTop && (
        <button className="scroll-top-btn" onClick={scrollToTop}>
          ↑
        </button>
      )}
    </>
  );
}
