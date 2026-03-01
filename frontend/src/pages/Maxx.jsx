import "./Maxx.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadRazorpay } from "../services/razorpay";
import { auth } from "../firebase";

export default function Maxx() {
  const navigate = useNavigate();
  const [showWhatsapp, setShowWhatsapp] = useState(false);

  // 🔒 Route Protection
  

  const WHATSAPP_NUMBER = "919019873827";
  const MESSAGE =
    "Hi 👋 I’m interested in learning more about your premium plans.";

  const openWhatsapp = () => {
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGE)}`,
      "_blank"
    );
  };

  // rest of your Maxx code remains exactly same...

  const handlePayment = async (amount, plan) => {
    const handlePayment = async (amount, plan) => {
  const user = auth.currentUser;

  if (!user) {
    navigate("/signin");
    return;
  }

  const token = await user.getIdToken(true);

  await loadRazorpay();

  const res = await fetch(
    "https://melo-logo-studio.onrender.com/api/payment/create-order",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const order = await res.json();

  new window.Razorpay({
    key: process.env.REACT_APP_RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: "INR",
    name: "Melo Studio",
    description: plan,
    order_id: order.id,
    handler: () => navigate("/success"),
    theme: { color: "#ff4da6" },
  }).open();
};

    await loadRazorpay();

    const res = await fetch("http://localhost:5000/api/payment/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount }),
    });

    const order = await res.json();

    new window.Razorpay({
      key: "rzp_test_xxxxx",
      amount: order.amount,
      currency: "INR",
      name: "Insta Logo Studio",
      description: plan,
      order_id: order.id,
      handler: () => navigate("/success"),
      theme: { color: "#ff4da6" },
    }).open();
  };

  return (
    <>
      <section className="pricing-page">
        <h1 className="pricing-title">Choose your plan</h1>
        <p className="pricing-subtitle">
          Start creating professional logos and get complete branding done for you
        </p>

        <div className="pricing-grid">
          <PriceCard
            title="IG Trust Kit"
            price="₹1,999"
            items={[
              "Logo system",
              "Brand colors & fonts",
              "Instagram-ready exports",
            ]}
            onPay={() => handlePayment(1999, "Instagram Trust Kit")}
          />

          <PriceCard
            title="IG Sales Kit"
            price="₹6,999"
            items={[
              "Brand Foundation included",
              "10 product photos",
              "5 Instagram videos",
              "Post & story templates",
            ]}
            onPay={() => handlePayment(6999, "Instagram Selling Starter")}
            
          />

          <PriceCard
            popular
            title="IG Money Kit"
            price="₹14,999"
            items={[
              "Everything in starter kit",
              "3 ad-ready creatives",
              "10 viral reel ideas",
              "Brand usage guidance",
            ]}
            onPay={() => handlePayment(14999, "Instagram Sales Launch")}
            
          />
        </div>
      </section>

      {/* Floating WhatsApp */}
      <div className="whatsapp-float" onClick={() => setShowWhatsapp(true)}>
        <img src="/whatsapp.svg" alt="WhatsApp" />
        <span>Need help choosing a plan?</span>
      </div>

      {/* WhatsApp Popup */}
      {showWhatsapp && (
        <div className="wa-overlay" onClick={() => setShowWhatsapp(false)}>
          <div className="wa-modal" onClick={(e) => e.stopPropagation()}>
            <div className="wa-header">
              <img src="/whatsapp.svg" alt="" />
              <span>Chat with us on WhatsApp</span>
              <button onClick={() => setShowWhatsapp(false)}>✕</button>
            </div>

            <div className="wa-body">
              <p>
                Hi there! Let’s help you pick the best premium plan for your
                business.
              </p>

              <div className="wa-bubble">
                👋 I’m interested in learning more about your premium plans.
              </div>

              <button className="wa-continue" onClick={openWhatsapp}>
                Continue to Chat
              </button>

              <p className="wa-phone">🇮🇳 +91 9019873827</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function PriceCard({ title, price, items, onPay, onChat, popular }) {
  return (
    <div className={`price-card ${popular ? "popular" : ""}`}>
      {popular && <span className="badge">Most Popular</span>}
      <h3>{title}</h3>
      <h2>{price}</h2>
      <span className="price-duration">one-time</span>

      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <button className="primary-btn" onClick={onPay}>
        Continue with Premium
      </button>

      {onChat && (
        <button className="whatsapp-btn" onClick={onChat}>
          <img src="/whatsapp.svg" alt="" />
          Chat with us
        </button>
      )}
    </div>
  );
}
