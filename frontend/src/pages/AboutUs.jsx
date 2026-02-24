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
        Melo – Where Ideas Turn Into Impact
      </h2>

      <p>
        Built with passion and purpose, Melo is more than a tech startup. 
        We create digital experiences that feel human. 
        From web platforms to scalable products, we blend clean design,
        strong engineering, and real business thinking to build solutions 
        that actually matter.
      </p>

      {/* FEATURES */}
      <div className="feature-grid">
        <div className="feature-card">
          <h3>Driven by Creativity</h3>
          <p>
            We believe great products start with bold ideas. Creativity fuels everything we build, 
            from concept to deployment.
          </p>
        </div>

        <div className="feature-card">
          <h3>Built with Precision</h3>
          <p>
            Clean code. Smart architecture. Scalable systems. 
            We focus on building technology that performs today and
            grows tomorrow.
          </p>
        </div>

        <div className="feature-card">
          <h3>Curious by Nature</h3>
          <p>
            We explore, experiment, and improve continuously. 
            Every challenge is an opportunity to learn and build better.
          </p>
        </div>

        <div className="feature-card">
          <h3>Growing Together</h3>
          <p>
            Your success is our success. We collaborate closely, adapt 
            quickly, and move forward as one team.
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
