import React from "react";
import { useNavigate } from "react-router-dom";
import "./Explore.css";

// Base image
import techBase from "../assets/images/tech.jpg";

// Individual imports (Check your folder for exact spelling/spaces!)
import t1 from "../assets/images/Tech 1.jpg";
import t2 from "../assets/images/Tech 2.jpg";
import t3 from "../assets/images/Tech 3.jpg";
import t4 from "../assets/images/Tech 4.jpg";
import t5 from "../assets/images/Tech 5.jpg";
import t6 from "../assets/images/Tech 6.jpg";
import t7 from "../assets/images/Tech 7.jpg";
import t8 from "../assets/images/Tech 8.jpg";
import t9 from "../assets/images/Tech 9.jpg";
import t10 from "../assets/images/Tech 10.jpg";
import t11 from "../assets/images/Tech 11.jpg";
import t12 from "../assets/images/Tech 12.jpg"; 
import t13 from "../assets/images/Tech 13.jpg"; 
import t14 from "../assets/images/Tech 14.jpg";
import t15 from "../assets/images/Tech 15.jpg";
import t16 from "../assets/images/Tech 16.jpg";
import t17 from "../assets/images/Tech 17.jpg";
import t18 from "../assets/images/Tech 18.jpg";
import t19 from "../assets/images/Tech 19.jpg";
import t20 from "../assets/images/Tech 20.jpg";
import t21 from "../assets/images/Tech 21.jpg";
import t22 from "../assets/images/Tech 22.jpg";
import t23 from "../assets/images/Tech 23.jpg";
import t24 from "../assets/images/Tech 24.jpg";
import t25 from "../assets/images/Tech 25.jpg";

const Tech = () => {
  const navigate = useNavigate();

  const images = [
    techBase, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10,
    t11, t12, t13, t14, t15, t16, t17, t18, t19, t20, t21, t22, t23, t24, t25
  ];

  return (
    <div className="explore-container"> {/* Changed to generic container */}
      <div className="category-header">
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back
        </button>
        <h2>Tech Startup Logos</h2>
      </div>

      <div className="logo-grid"> {/* Use existing Home.jsx grid class for consistency */}
        {images.map((img, index) => (
          <div
            key={index}
            className="logo-card" 
            onClick={() => navigate("/payment")}
          >
            <img src={img} alt={`Tech ${index}`} loading="lazy" />
            <div className="watermark">MELO</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tech;