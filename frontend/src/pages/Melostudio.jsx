import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Melostudio.css";
import { FiDownload } from "react-icons/fi";

export default function Melostudio() {
  const navigate = useNavigate();

  // 🔒 Route Protection
  useEffect(() => {
    const unlocked = sessionStorage.getItem("premiumUnlocked");
    if (!unlocked) {
      navigate("/payment-success");
    }
  }, [navigate]);

  const [style, setStyle] = useState("Minimal");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");

  const generateLogo = async () => {
    if (!prompt.trim()) {
      setError("Please describe your logo");
      return;
    }

    setError("");
    setLoading(true);
    setImages([]);

    try {
      const finalPrompt = `${style} style logo. ${prompt}`;

      const res = await fetch("http://localhost:5000/api/generate/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: finalPrompt }),
      });

      if (!res.ok) {
        throw new Error("Server error");
      }

      const data = await res.json();

      if (!data.images || data.images.length === 0) {
        throw new Error("No images returned");
      }

      setImages(data.images);
    } catch (err) {
      console.error(err);
      setError("Failed to generate logo. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (url, index) => {
    try {
      const res = await fetch("http://localhost:5000/api/generate/download-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl: url }),
      });

      if (!res.ok) {
        throw new Error("Download failed");
      }

      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `melo-logo-${index + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);

    } catch (error) {
      console.error("Download error:", error);
      alert("Download failed");
    }
  };

  return (
    <section className="ai-page">
      <div className="ai-header">
        <h1>AI Logo Generator</h1>
        <p>Describe your brand and let AI create professional logos instantly</p>
      </div>

      <div className="ai-card">
        <label>Describe your logo</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="A minimal pink logo for a beauty brand"
        />

        <h4>Choose your style</h4>

        <div className="style-grid">
          {[
            { name: "Minimal", desc: "Clean and modern" },
            { name: "Luxury", desc: "Elegant and premium" },
            { name: "Modern", desc: "Bold and contemporary" },
            { name: "Playful", desc: "Fun and friendly" },
            { name: "Tech", desc: "Innovative and digital" },
          ].map((item) => (
            <button
              key={item.name}
              className={`style-card ${style === item.name ? "active" : ""}`}
              onClick={() => setStyle(item.name)}
              type="button"
            >
              <span>{item.name}</span>
              <small>{item.desc}</small>
            </button>
          ))}
        </div>

        <button
          className="generate-btn"
          onClick={generateLogo}
          disabled={loading}
        >
          {loading ? "Generating logos..." : "Generate Logos"}
        </button>

        {error && <p className="error-text">{error}</p>}

        {images.length > 0 && (
          <div className="result-grid">
            {images.map((img, index) => (
              <div key={index} className="logo-tile">
                <img src={img} alt={`Logo ${index + 1}`} />

                <button
                  className="download-btn"
                  onClick={() => handleDownload(img, index)}
                >
                  <FiDownload size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}