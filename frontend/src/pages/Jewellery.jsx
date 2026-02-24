import React from "react";
import { useNavigate } from "react-router-dom";
import "./Explore.css";

// Asset Imports
import jBase from "../assets/images/Jewellery.jpg";
import j1 from "../assets/images/Jewellery 1.jpg";
import j2 from "../assets/images/Jewellery 2.jpg";
import j3 from "../assets/images/Jewellery 3.jpg";
import j4 from "../assets/images/Jewellery 4.jpg";
import j5 from "../assets/images/Jewellery 5.jpg";
import j6 from "../assets/images/Jewellery 6.jpg";
import j7 from "../assets/images/Jewellery 7.jpg";
import j8 from "../assets/images/Jewellery 8.jpg";
import j9 from "../assets/images/Jewellery 9.jpg";
import j10 from "../assets/images/Jewellery 10.jpg";
import j11 from "../assets/images/Jewellery 11.jpg";
import j12 from "../assets/images/Jewellery 12.jpg";
import j13 from "../assets/images/Jewelley 13.jpg"; 
import j14 from "../assets/images/Jewellery 14.jpg";
import j16 from "../assets/images/Jewellery 16.jpg";
import j17 from "../assets/images/Jewellery 17.jpg";
import j18 from "../assets/images/Jewellery 18.jpg";
import j19 from "../assets/images/Jewellery 19.jpg";
import j20 from "../assets/images/Jewellery 20.jpg";
import j21 from "../assets/images/Jewellery 21.jpg";
import j22 from "../assets/images/Jewellery 22.jpg";
import j23 from "../assets/images/Jewellery 23.jpg";
import j24 from "../assets/images/Jewelley 24.jpg"; 
import j25 from "../assets/images/Jewellery 25.jpg";
import j26 from "../assets/images/Jewellery 26.jpg";
import j27 from "../assets/images/Jewellery 27.jpg";

const Jewellery = () => {
  const navigate = useNavigate();

  const images = [
    jBase, j1, j2, j3, j4, j5, j6, j7, j8, j9, j10, 
    j11, j12, j13, j14, j16, j17, j18, j19, j20, 
    j21, j22, j23, j24, j25, j26, j27
  ];

  return (
    <div className="beauty-page"> 
      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back
      </button>

      <h2>Luxury Jewellery Logos</h2>

      <div className="preview-grid">
        {images.map((img, index) => (
          <div
            key={index}
            className="preview-card"
            onClick={() => navigate("/payment")}
          >
            <img src={img} alt={`Jewellery ${index}`} />
            <div className="watermark">MELO</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Jewellery; // This must be at the very bottom