import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero">
      <h1>
        Create a logo that helps <span>sell more</span> on Instagram
      </h1>

      <p>
        Professional AI-powered logos designed for modern creators, Instagram
        sellers, and startups.
      </p>

      <input
        className="hero-input"
        placeholder="A minimal pink logo for a beauty brand on Instagram"
      />

      <button className="primary-btn">Generate my logo</button>
    </section>
  );
}
