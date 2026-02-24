import { useNavigate } from "react-router-dom";
import "./Explore.css";

/* Note: Your folder doesn't show "Beauty 1.jpg". 
  It has "Beauty.jpg" and then starts at "Beauty 2.jpg".
*/
import beautyBase from "../assets/images/Beauty.jpg";
import beauty2 from "../assets/images/Beauty 2.jpg";
import beauty3 from "../assets/images/Beauty 3.jpg";
import beauty4 from "../assets/images/Beauty 4.jpg";
import beauty5 from "../assets/images/Beauty 5.jpg";
import beauty6 from "../assets/images/Beauty 6.jpg";
import beauty7 from "../assets/images/Beauty 7.jpg";
import beauty8 from "../assets/images/Beauty 8.jpg";
import beauty9 from "../assets/images/Beauty 9.jpg";
import beauty10 from "../assets/images/Beauty 10.jpg";
import beauty11 from "../assets/images/Beauty 11.jpg";
import beauty12 from "../assets/images/Beauty 12.jpg";
import beauty13 from "../assets/images/Beauty 13.jpg";
import beauty14 from "../assets/images/Beauty 14.jpg";
import beauty15 from "../assets/images/Beauty 15.jpg";
import beauty16 from "../assets/images/Beauty 16.jpg";
import beauty17 from "../assets/images/Beauty 17.jpg";
import beauty18 from "../assets/images/Beauty 18.jpg";
import beauty19 from "../assets/images/Beauty 19.jpg";
import beauty20 from "../assets/images/Beauty 20.jpg";
import beauty21 from "../assets/images/Beauty 21.jpg";
import beauty22 from "../assets/images/Beauty 22.jpg";

export default function BeautyBrand() {
  const navigate = useNavigate();

  // Create the array with all unique variables
  const images = [
    beautyBase, beauty2, beauty3, beauty4, beauty5, 
    beauty6, beauty7, beauty8, beauty9, beauty10, 
    beauty11, beauty12, beauty13, beauty14, beauty15, 
    beauty16, beauty17, beauty18, beauty19, beauty20, 
    beauty21, beauty22
  ];

  return (
    <div className="beauty-page">
      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back
      </button>

      <h2>Beauty Brand Logos</h2>

      <div className="preview-grid">
        {images.map((img, index) => (
          <div
            key={index}
            className="preview-card"
            onClick={() => navigate("/payment")}
          >
            <img src={img} alt={`Beauty Logo ${index + 1}`} />
            <div className="watermark">MELO</div>
          </div>
        ))}
      </div>
    </div>
  );
}