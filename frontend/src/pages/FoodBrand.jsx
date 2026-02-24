import React from "react";
import { useNavigate } from "react-router-dom";
import "./Explore.css";

/* Asset Imports */
import foodBase from "../assets/images/Food.jpg";
import f1 from "../assets/images/Food 1.jpg";
import f2 from "../assets/images/Food 2.jpg";
import f3 from "../assets/images/Food 3.jpg";
import f4 from "../assets/images/Food 4.jpg";
import f5 from "../assets/images/Food 5.jpg";
import f6 from "../assets/images/Food 6.jpg";
import f7 from "../assets/images/Food 7.jpg";
import f8 from "../assets/images/Food 8.jpg";
import f9 from "../assets/images/Food 9.jpg";
import f10 from "../assets/images/Food 10.jpg";
import f11 from "../assets/images/Food 11.jpg";
import f12 from "../assets/images/Food 12.jpg";
import f13 from "../assets/images/Food 13.jpg";
import f14 from "../assets/images/Food 14.jpg";
import f15 from "../assets/images/Food 15.jpg";
import f16 from "../assets/images/Food 16.jpg";
import f17 from "../assets/images/Food 17.jpg";
import f18 from "../assets/images/Food 18.jpg";
import f19 from "../assets/images/Food 19.jpg";
import f20 from "../assets/images/Food 20.jpg";
import f21 from "../assets/images/Food 21.jpg";

const FoodBrand = () => {
  const navigate = useNavigate();

  const images = [
    foodBase, f1, f2, f3, f4, f5, f6, f7, f8, f9, f10,
    f11, f12, f13, f14, f15, f16, f17, f18, f19, f20, f21
  ];

  return (
    <div className="beauty-page"> 
      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back
      </button>

      <h2>Food Brand Logos</h2>

      <div className="preview-grid">
        {images.map((img, index) => (
          <div
            key={index}
            className="preview-card"
            onClick={() => navigate("/payment")}
          >
            <img src={img} alt={`Food Logo ${index}`} />
            <div className="watermark">MELO</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodBrand;