import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Explore.css";

/* Category Cover Images */
import beauty from "../assets/images/Beauty.jpg";
import fashion from "../assets/images/Fashion.jpg";
import BakeryImg from "../assets/images/Bakery.jpg";
import JewelleryImg from "../assets/images/Jewellery.jpg";
import tech from "../assets/images/tech.jpg";
import food from "../assets/images/Food.jpg";
import skincareImg from "../assets/images/skincare.jpg";
import petsupplies from "../assets/images/petsupplies.jpg";

const prompts = [
  "A minimal pink logo for a beauty brand",
  "Luxury gold jewellery branding",
  "Modern tech startup logo",
  "Instagram fitness flyer design",
  "Elegant bakery pastel logo",
];

const logos = [
  { title: "Beauty Brand", img: beauty, path: "/beauty-brand" },
  { title: "Fashion Store", img: fashion, path: "/fashion" },
  { title: "Bakery", img: BakeryImg, path: "/bakery" },
  { title: "Jewellery", img: JewelleryImg, path: "/jewellery" },
  { title: "Tech Startup", img: tech, path: "/tech" },
  { title: "Food Brand", img: food, path: "/food-brand" },
  { title: "Skincare", img: skincareImg, path: "/skincare" },
  { title: "Pet Supplies", img: petsupplies, path: "/pet-supplies" }, // Updated from /signup to /pet-supplies
];

export default function Home() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [inputValue, setInputValue] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [promptIndex, setPromptIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  /* Typing animation */
  useEffect(() => {
    const currentFullText = prompts[promptIndex];
    const typingSpeed = isDeleting ? 50 : 100;

    const timeout = setTimeout(() => {
      if (!isDeleting && charIndex < currentFullText.length) {
        setPlaceholder(currentFullText.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      } else if (isDeleting && charIndex > 0) {
        setPlaceholder(currentFullText.substring(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
      } else if (!isDeleting && charIndex === currentFullText.length) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setPromptIndex((prev) => (prev + 1) % prompts.length);
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, promptIndex]);

  /* Scroll handler */
  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handlePlusClick = () => {
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  // FIX: Check the isPaid property inside the user object
  if (user && user.isPaid) {
    fileInputRef.current.click();
  } else {
    navigate("/signup");
  }
};

  const handleGenerate = () => {
    if (inputValue.trim() || placeholder) {
      navigate("/signup");
    }
  };

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <h1>
          Create a logo that helps you{" "}
          <span className="pink">sell more</span> on Instagram
        </h1>

        <p>
          Professional AI-powered logos designed for creators and modern brands.
        </p>

        <div className="search-container">
          <div className="prompt-container-main">
            <div className="input-wrapper">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={placeholder}
                className="clean-input"
              />
            </div>

            <div className="icon-row">
              <button
                type="button"
                className="minimal-plus-btn"
                onClick={handlePlusClick}
              >
                +
              </button>

              <button
                type="button"
                className="minimal-arrow-btn"
                onClick={handleGenerate}
              >
                ↑
              </button>
            </div>

            <input type="file" ref={fileInputRef} hidden />
          </div>
        </div>
      </section>

      {/* EXPLORE */}
      <section className="explore-page">
        <h1>Explore AI-Generated Logos</h1>

        <div className="logo-grid">
          {logos.map((item, index) => (
            <div
              key={index}
              className="logo-card"
              onClick={() => {
                if (item.path) {
                  navigate(item.path);
                } else {
                  navigate("/signup");
                }
              }}
            >
              <img src={item.img} alt={item.title} />
              <p>{item.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="free-ai">
        <div className="stars">★★★★★</div>
        <p className="trusted">Trusted by users</p>

        <h2>Free Online AI Designers</h2>
        <p className="desc">
          Watch your ideas transform into stunning designs.
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

      {showScrollTop && (
        <button
          className="scroll-top-btn"
          onClick={() =>
            window.scrollTo({ top: 0, behavior: "smooth" })
          }
        >
          ↑
        </button>
      )}
    </>
  );
}