import "./Explore.css";

import beauty from "../assets/images/Beauty.jpg";
import fashion from "../assets/images/Fashion.jpg";
import Bakery from "../assets/images/Bakery.jpg";
import Jewellery from "../assets/images/Jewellery.jpg";
import tech from "../assets/images/tech.jpg";
import food from "../assets/images/Food.jpg";
import skincare from "../assets/images/skincare.jpg";
import petsupplies from "../assets/images/petsupplies.jpg";

const logos = [
  { title: "Beauty Brand", img: beauty },
  { title: "Fashion Store", img: fashion },
  { title: "Bakery", img: Bakery },
  { title: "Jewllery", img: Jewellery },
  { title: "Tech Startup", img: tech },
  { title: "Food Brand", img: food },
  { title: "Skincare", img: skincare },
  { title: "petsupplies", img: petsupplies },
  
 
  
];

export default function Home() {
  return (
    <>
      {/* HERO SECTION */}
      <section
        style={{
          padding: "120px 24px",
          textAlign: "center",
          background: "linear-gradient(180deg, #ffffff 0%, #fff5fa 100%)",
        }}
      >
        <h1
          style={{
            fontSize: "52px",
            fontWeight: "800",
            maxWidth: "860px",
            margin: "0 auto",
            lineHeight: "1.15",
          }}
        >
          Create a logo that helps you{" "}
          <span style={{ color: "#ff4da6" }}>sell more</span> on Instagram
        </h1>

        <p
          style={{
            marginTop: "20px",
            fontSize: "17px",
            color: "#555",
            maxWidth: "640px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Professional AI-powered logos designed for creators, Instagram sellers,
          and modern startups.
        </p>

        <div style={{ marginTop: "36px" }}>
          <input
            placeholder="A minimal pink logo for a beauty brand on Instagram"
            style={{
              width: "100%",
              maxWidth: "560px",
              padding: "16px 20px",
              borderRadius: "14px",
              border: "1px solid #ddd",
              fontSize: "15px",
              outline: "none",
              boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
            }}
          />
        </div>

        <button
          style={{
            marginTop: "28px",
            background: "#ff4da6",
            color: "#fff",
            padding: "16px 36px",
            borderRadius: "32px",
            border: "none",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 14px 40px rgba(255,77,166,0.4)",
          }}
        >
          Generate my logo
        </button>

        <p style={{ marginTop: "12px", fontSize: "12px", color: "#999" }}>
          No credit card required · Create in seconds
        </p>
      </section>

      {/* EXPLORE SECTION (ALWAYS VISIBLE BELOW HERO) */}
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
    </>
  );
}
