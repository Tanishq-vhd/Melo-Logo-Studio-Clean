import React from "react";
import { useNavigate } from "react-router-dom";
import "./Explore.css";

/* Asset Imports */
import sBase from "../assets/images/skincare.jpg";
import s1 from "../assets/images/Skincare 1.jpg";
import s2 from "../assets/images/Skincare 2.jpg";
import s3 from "../assets/images/Skincare 3.jpg";
import s4 from "../assets/images/Skincare 4.jpg";
import s5 from "../assets/images/Skincare 5.jpg";
import s6 from "../assets/images/Skincare 6.jpg";
import s7 from "../assets/images/Skincare 7.jpg";
import s8 from "../assets/images/Skincare 8.jpg";
import s9 from "../assets/images/Skincare 9.jpg";
import s10 from "../assets/images/Skincare 10.jpg";
import s11 from "../assets/images/Skincare 11.jpg";
import s12 from "../assets/images/Skincare 12.jpg";
import s13 from "../assets/images/Skincare 13.jpg";
import s14 from "../assets/images/Skincare 14.jpg";
import s15 from "../assets/images/Skincare 15.jpg";
import s16 from "../assets/images/Skincare 16.jpg";
import s17 from "../assets/images/Skincare 17.jpg";
import s18 from "../assets/images/Skincare 18.jpg";
import s19 from "../assets/images/Skincare 19.jpg";
import s20 from "../assets/images/Skincare 20.jpg";
import s21 from "../assets/images/Skincare 21.jpg";
import s22 from "../assets/images/Skincare 22.jpg";
import s23 from "../assets/images/Skincare 23.jpg";

const Skincare = () => {
  const navigate = useNavigate();

  const images = [
    sBase, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10,
    s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23
  ];

  return (
    <div className="beauty-page"> 
      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back
      </button>

      <h2>Skincare & Glow Logos</h2>

      <div className="preview-grid">
        {images.map((img, index) => (
          <div
            key={index}
            className="preview-card"
            onClick={() => navigate("/payment")}
          >
            <img src={img} alt={`Skincare Logo ${index}`} />
            <div className="watermark">MELO</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skincare;