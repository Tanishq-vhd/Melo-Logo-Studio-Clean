import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Explore.css";

/* Category Cover Images */
import beauty from "../assets/images/Beauty.jpg";
import fashion from "../assets/images/Fashion.jpg";
import Bakery from "../assets/images/Bakery.jpg";
import Jewellery from "../assets/images/Jewellery.jpg";
import tech from "../assets/images/tech.jpg";
import food from "../assets/images/Food.jpg";
import skincare from "../assets/images/skincare.jpg";
import petsupplies from "../assets/images/petsupplies.jpg";

/* Beauty */
import beauty1 from "../assets/images/Beauty 1.jpg";
import beauty2 from "../assets/images/Beauty 2.jpg";
import beauty3 from "../assets/images/Beauty 3.jpg";

/* Fashion */
import fashion1 from "../assets/images/Fashion 1.jpg";
import fashion2 from "../assets/images/Fashion 2.jpg";
import fashion3 from "../assets/images/Fashion 3.jpg";

/* Bakery */
import bakery1 from "../assets/images/Bakery 1.jpg";
import bakery2 from "../assets/images/Bakery 2.jpg";
import bakery3 from "../assets/images/Bakery 3.jpg";

/* Jewellery */
import jewellery1 from "../assets/images/Jewellery 1.jpg";
import jewellery2 from "../assets/images/Jewellery 2.jpg";
import jewellery3 from "../assets/images/Jewellery 3.jpg";

/* Tech */
import tech1 from "../assets/images/Tech 1.jpg";
import tech2 from "../assets/images/Tech 2.jpg";
import tech3 from "../assets/images/Tech 3.jpg";

/* Food */
import food1 from "../assets/images/Food 1.jpg";
import food2 from "../assets/images/Food 2.jpg";
import food3 from "../assets/images/Food 3.jpg";

/* Skincare */
import skin1 from "../assets/images/Skin 1.jpg";
import skin2 from "../assets/images/Skin 2.jpg";
import skin3 from "../assets/images/Skin 3.jpg";

/* Pets */
import pet1 from "../assets/images/Pet 1.jpg";
import pet2 from "../assets/images/Pet 2.jpg";
import pet3 from "../assets/images/Pet 3.jpg";

const prompts = [
  "A minimal pink logo for a beauty brand",
  "Luxury gold jewellery branding",
  "Modern tech startup logo",
  "Instagram fitness flyer design",
  "Elegant bakery pastel logo",
];

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

const categoryPreviews = {
  "Beauty Brand": [beauty1, beauty2, beauty3],
  "Fashion Store": [fashion1, fashion2, fashion3],
  Bakery: [bakery1, bakery2, bakery3],
  Jewellery: [jewellery1, jewellery2, jewellery3],
  "Tech Startup": [tech1, tech2, tech3],
  "Food Brand": [food1, food2, food3],
  Skincare: [skin1, skin2, skin3],
  "Pet Supplies": [pet1, pet2, pet3],
};

export default function Home() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [inputValue, setInputValue] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [promptIndex, setPromptIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

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

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handlePlusClick = () => {
    const isPaid = localStorage.getItem("isPaid");
    if (isPaid === "true") {
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
      <section
        className="explore-page"
        onClick={() => {
          if (selectedCategory) {
            navigate("/payment");
          }
        }}
      >
        <h1>Explore AI-Generated Logos</h1>

        <div className="logo-grid">
          {logos.map((item, index) => (
            <div
              key={index}
              className={`logo-card ${
                selectedCategory && selectedCategory !== item.title
                  ? "blurred"
                  : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                if (selectedCategory === item.title) {
                  setSelectedCategory(null);
                } else {
                  setSelectedCategory(item.title);
                }
              }}
            >
              <img src={item.img} alt={item.title} />
              <p>{item.title}</p>
            </div>
          ))}
        </div>

        {selectedCategory && (
  <div className="preview-section">
    {categoryPreviews[selectedCategory].map((img, index) => (
      <div
        key={index}
        className="preview-card premium-tile"
        onClick={() => navigate("/payment")}
      >
        <img src={img} alt="Preview logo" />

        {/* WATERMARK */}
        <div className="watermark">
          MELO
        </div>
      </div>
    ))}

    <div
      className="preview-plus premium-tile"
      onClick={() => navigate("/payment")}
    >
      <div className="preview-plus-content">
        <span>+</span>
        <p>Unlock Premium</p>
      </div>

      <div className="watermark">
        melo
      </div>
    </div>
  </div>
)}

        
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
