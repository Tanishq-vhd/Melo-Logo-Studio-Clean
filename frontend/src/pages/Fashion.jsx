import { useNavigate } from "react-router-dom";
import "./Explore.css";

/* Import fashion images from your assets folder */
import fashionBase from "../assets/images/Fashion.jpg";
import fashion1 from "../assets/images/Fashion 1.jpg";
import fashion2 from "../assets/images/Fashion 2.jpg";
import fashion3 from "../assets/images/Fashion 3.jpg";
import fashion4 from "../assets/images/Fashion 4.jpg";
import fashion5 from "../assets/images/Fashion 5.jpg";
import fashion6 from "../assets/images/Fashion 6.jpg";
import fashion7 from "../assets/images/Fashion 7.jpg";
import fashion8 from "../assets/images/Fashion 8.jpg";
import fashion9 from "../assets/images/Fashion 9.jpg";
import fashion10 from "../assets/images/Fashion 10.jpg";
import fashion11 from "../assets/images/Fashion 11.jpg";
import fashion12 from "../assets/images/Fashion 12.jpg";
import fashion13 from "../assets/images/Fashion 13.jpg";
import fashion14 from "../assets/images/Fashion 14.jpg";
import fashion15 from "../assets/images/Fashion 15.jpg";
import fashion16 from "../assets/images/Fashion 16.jpg";
import fashion17 from "../assets/images/Fashion 17.jpg";

export default function Fashion() {
  const navigate = useNavigate();

  const images = [
    fashionBase, fashion1, fashion2, fashion3, fashion4, 
    fashion5, fashion6, fashion7, fashion8, fashion9, 
    fashion10, fashion11, fashion12, fashion13, fashion14, 
    fashion15, fashion16, fashion17
  ];

  return (
    /* Using .beauty-page to inherit the 60px 40px padding and background */
    <div className="beauty-page"> 
      
      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back
      </button>

      <h2>Fashion Store Logos</h2>

      {/* Using .preview-grid for the 250px column mapping and 20px gap */}
      <div className="preview-grid">
        {images.map((img, index) => (
          <div
            key={index}
            className="preview-card"
            onClick={() => navigate("/payment")}
          >
            <img src={img} alt={`Fashion Logo ${index + 1}`} />
            
            {/* Watermark styled to appear at the bottom right */}
            <div className="watermark">MELO</div>
          </div>
        ))}
      </div>

    </div>
  );
}