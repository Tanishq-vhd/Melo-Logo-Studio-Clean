import { useState } from "react";
import "./Melostudio.css";

export default function Melostudio() {
  const [style, setStyle] = useState("Minimal");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState("");

  const generateLogo = async () => {
    if (!prompt.trim()) {
      setError("Please describe your logo");
      return;
    }

    setError("");
    setLoading(true);
    setImageUrl(null);

    try {
      const res = await fetch("http://localhost:5000/generate-logo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          style
        })
      });

      const data = await res.json();
      setImageUrl(data.imageUrl);
    } catch (err) {
      setError("Failed to generate logo. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="ai-page">
      <div className="ai-header">
        <h1>AI Logo Generator</h1>
        <p>
          Describe your brand and let AI create professional logos instantly
        </p>
      </div>

      <div className="ai-card">
        <label>Describe your logo</label>
        <textarea
          placeholder="A minimal pink logo for a beauty brand on Instagram, elegant and modern with soft curves"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <h4>Choose your style</h4>

        <div className="style-grid">
          {[
            { name: "Minimal", desc: "Clean and modern" },
            { name: "Luxury", desc: "Elegant and premium" },
            { name: "Modern", desc: "Bold and contemporary" },
            { name: "Playful", desc: "Fun and friendly" },
            { name: "Tech", desc: "Innovative and digital" }
          ].map((item) => (
            <button
              key={item.name}
              className={`style-card ${
                style === item.name ? "active" : ""
              }`}
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
          {loading ? "✨ Generating logo..." : "✨ Generate Logo"}
        </button>

        {error && <p className="error-text">{error}</p>}

        {imageUrl && (
          <div className="result-box">
            <img src={imageUrl} alt="Generated logo" />
          </div>
        )}
      </div>
    </section>
  );
}
