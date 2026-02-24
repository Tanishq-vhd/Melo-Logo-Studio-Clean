import { useNavigate } from "react-router-dom";
import "./Explore.css";

/* Imports */
import bakeryBase from "../assets/images/Bakery.jpg";
import b1 from "../assets/images/Bakery 1.jpg";
import b2 from "../assets/images/Bakery 2.jpg";
import b3 from "../assets/images/Bakery 3.jpg";
import b4 from "../assets/images/Bakery 4.jpg";
import b5 from "../assets/images/Bakery 5.jpg";
import b6 from "../assets/images/Bakery 6.jpg";
import b7 from "../assets/images/Bakery 7.jpg";
import b8 from "../assets/images/Bakery 8.jpg";
import b9 from "../assets/images/Bakery 9.jpg";
import b10 from "../assets/images/Bakery 10.jpg";
import b11 from "../assets/images/Bakery 11.jpg";
import b12 from "../assets/images/Bakery 12.jpg";
import b13 from "../assets/images/Bakery 13.jpg";
import b14 from "../assets/images/Bakery 14.jpg";

export default function Bakery() {
  const navigate = useNavigate();
  const images = [bakeryBase, b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11, b12, b13, b14];

  return (
    <div className="beauty-page"> 
      <button className="back-btn" onClick={() => navigate("/")}>← Back</button>
      <h2>Bakery Logos</h2>
      <div className="preview-grid">
        {images.map((img, index) => (
          <div key={index} className="preview-card" onClick={() => navigate("/payment")}>
            <img src={img} alt={`Bakery ${index}`} />
            <div className="watermark">MELO</div>
          </div>
        ))}
      </div>
    </div>
  );
}