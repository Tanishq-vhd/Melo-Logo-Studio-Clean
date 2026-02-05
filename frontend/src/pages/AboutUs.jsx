import "./PolicyPages.css";

export default function AboutUs() {
  const EMAIL = "tanya@bhkinterior.com";

  const openMail = () => {
    window.location.href = `mailto:${EMAIL}`;
  };

  return (
    <div className="policy-container">
      {/* HEADER */}
      <h1>About us</h1>
      <h2 className="sub-heading">
        Idealabs – Weaving Tech with Heart
      </h2>

      <p>
        Born from a vibrant innovation hub, IdeaLabs emerged as a catalyst for
        tech-driven transformation. We extend our expertise beyond the app and
        product development to encompass the realms of strategic marketing and
        brand elevation, ensuring your vision takes center stage in the digital
        realm.
      </p>

      {/* FEATURES */}
      <div className="feature-grid">
        <div className="feature-card">
          <h3>Boundless Imagination</h3>
          <p>
            Our audacious ambitions carve an uncharted path to an infinite
            realm of possibilities.
          </p>
        </div>

        <div className="feature-card">
          <h3>Embrace the Enigma</h3>
          <p>
            In the pursuit of innovation, we cherish experimentation and the
            wealth of insights born from trial.
          </p>
        </div>

        <div className="feature-card">
          <h3>Curiosity Ignites Exploration</h3>
          <p>
            Challenging conventions and venturing into the unknown, we redefine
            solutions that captivate minds and markets alike.
          </p>
        </div>

        <div className="feature-card">
          <h3>Empower Your Ascension</h3>
          <p>
            Our trajectory propels upward, inviting you to evolve in tandem.
          </p>
        </div>
      </div>

      {/* CONNECT */}
      <div className="connect-box">
        <h2>Connect with Us</h2>
        <button className="primary-btn" onClick={openMail}>
          Join Us
        </button>
      </div>

      {/* CONTACT INFO */}
      <div className="contact-row">
        <div>
          <strong>Address</strong>
          <p>
            C129, Assetz Canvas and Cove Phase 1,
            <br />
            Begur, Bengaluru – 560014
          </p>
        </div>

        <div>
          <strong>Email</strong>
          <p>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </p>
        </div>
      </div>
    </div>
  );
}
