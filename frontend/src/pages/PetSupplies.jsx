import React from "react";
import { useNavigate } from "react-router-dom";
import "./Explore.css";

/* Asset Imports */
import petBase from "../assets/images/petsupplies.jpg";
import p1 from "../assets/images/Pet 1.jpg";
import p2 from "../assets/images/Pet 2.jpg";
import p3 from "../assets/images/Pet 3.jpg";
import p4 from "../assets/images/Pet 4.jpg";
import p5 from "../assets/images/Pet 5.jpg";
import p6 from "../assets/images/Pet 6.jpg";
import p7 from "../assets/images/Pet 7.jpg";
import p8 from "../assets/images/Pet 8.jpg";
import p9 from "../assets/images/Pet 9.jpg";
import p10 from "../assets/images/Pet 10.jpg";
import p11 from "../assets/images/Pet 11.jpg";
import p12 from "../assets/images/Pet 12.jpg";
import p13 from "../assets/images/Pet 13.jpg";
import p14 from "../assets/images/Pet 14.jpg";
import p15 from "../assets/images/Pet 15.jpg";
import p16 from "../assets/images/Pet 16.jpg";
import p17 from "../assets/images/Pet 17.jpg";
import p18 from "../assets/images/Pet 18.jpg";
import p19 from "../assets/images/Pet 19.jpg";
import p20 from "../assets/images/Pet 20.jpg";
import p21 from "../assets/images/Pet 21.jpg";
import p22 from "../assets/images/Pet 22.jpg";
import p23 from "../assets/images/Pet 23.jpg";
import p24 from "../assets/images/Pet 24.jpg";
import p25 from "../assets/images/Pet 25.jpg";

export default function PetSupplies() {
  const navigate = useNavigate();
  const images = [petBase, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16, p17, p18, p19, p20, p21, p22, p23, p24, p25];

  return (
    <div className="beauty-page"> 
      <button className="back-btn" onClick={() => navigate("/")}>← Back</button>
      <h2>Pet Supplies Logos</h2>
      <div className="preview-grid">
        {images.map((img, index) => (
          <div key={index} className="preview-card" onClick={() => navigate("/payment")}>
            <img src={img} alt={`Pet ${index}`} />
            <div className="watermark">MELO</div>
          </div>
        ))}
      </div>
    </div>
  );
}