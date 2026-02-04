import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Payment() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (loading) return;

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    if (!window.Razorpay) {
      console.error("Razorpay SDK not loaded");
      alert("Payment service not ready. Refresh the page.");
      return;
    }

    try {
      setLoading(true);

      // ✅ SEND AMOUNT PROPERLY
      const orderRes = await fetch(
        "http://localhost:5000/api/payment/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: 299, // 👈 REQUIRED BY BACKEND
          }),
        }
      );

      if (!orderRes.ok) {
        const err = await orderRes.json();
        console.error("Order creation error:", err);
        setLoading(false);
        return;
      }

      const order = await orderRes.json();
      console.log("Order created:", order);

      const options = {
        key: "rzp_test_SBBBNklr7fNhoX",
        amount: order.amount,
        currency: "INR",
        name: "Insta Logo Studio",
        description: "Premium Access",
        order_id: order.id,

        handler: async (response) => {
          try {
            const verifyRes = await fetch(
              "http://localhost:5000/api/payment/verify",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                }),
              }
            );

            if (!verifyRes.ok) {
              console.error("Payment verification failed");
              return;
            }

            localStorage.setItem("isPaid", "true");
            navigate("/ai-tools");
          } catch (err) {
            console.error("Verification error:", err);
          }
        },

        modal: {
          ondismiss: () => setLoading(false),
        },

        theme: {
          color: "#ff2f7d",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <p style={styles.topBadge}>✨ Your logo is ready to download</p>

        <h1 style={styles.heading}>
          Unlock your professional <br /> brand kit
        </h1>

        <p style={styles.subText}>
          Get unlimited variations, full commercial rights, and files optimized
          for every platform.
        </p>

        <div style={styles.features}>
          <Feature
            title="Unlimited logo variations"
            desc="Generate as many concepts as you need"
          />
          <Feature
            title="Full commercial license"
            desc="No watermarks, use anywhere you want"
          />
          <Feature
            title="All file formats included"
            desc="PNG, SVG, PDF — ready for any platform"
          />
        </div>

        <div style={styles.priceCard}>
          <div style={styles.priceHeader}>
            <span style={styles.plan}>Premium Access</span>
            <span style={styles.badge}>Limited time</span>
          </div>

          <div style={styles.price}>
            ₹299 <span style={styles.per}>/ month</span>
          </div>

          <p style={styles.cancel}>Cancel anytime</p>
        </div>

        <button
          style={{
            ...styles.cta,
            opacity: loading ? 0.85 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? "Opening payment…" : "Create my first logo"}
        </button>

        <p style={styles.footerText}>
          🔒 Secure payment • Cancel anytime
        </p>
      </div>
    </div>
  );
}

const Feature = ({ title, desc }) => (
  <div style={styles.featureItem}>
    <span style={styles.check}>✓</span>
    <div>
      <p style={styles.featureTitle}>{title}</p>
      <p style={styles.featureDesc}>{desc}</p>
    </div>
  </div>
);

/* 🎨 Styles unchanged */
const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #fff 0%, #fff5fa 60%, #ffffff 100%)",
    display: "flex",
    justifyContent: "center",
    padding: "36px 16px",
  },
  container: {
    width: "100%",
    maxWidth: "420px",
    background: "rgba(255,255,255,0.95)",
    borderRadius: "18px",
    padding: "30px 24px",
    textAlign: "center",
    boxShadow:
      "0 25px 50px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
  },
  topBadge: { color: "#ff3d8b", fontWeight: "600", marginBottom: "14px" },
  heading: { fontSize: "26px", fontWeight: "700" },
  subText: { fontSize: "14px", color: "#666", marginBottom: "22px" },
  features: { textAlign: "left", marginBottom: "22px" },
  featureItem: { display: "flex", gap: "10px", marginBottom: "10px" },
  check: { color: "#ff3d8b", fontWeight: "700" },
  featureTitle: { fontWeight: "600", fontSize: "14px" },
  featureDesc: { fontSize: "13px", color: "#777" },
  priceCard: {
    borderRadius: "14px",
    padding: "16px",
    width: "90%",
    background: "#fff7fb",
    border: "1.5px solid #ffd3e6",
  },
  priceHeader: { display: "flex", justifyContent: "space-between" },
  plan: { fontWeight: "600" },
  badge: {
    background: "#ffe8f1",
    color: "#ff3d8b",
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "11px",
  },
  price: { fontSize: "22px" },
  per: { fontSize: "14px", color: "#777" },
  cancel: { fontSize: "12px", color: "#888" },
  cta: {
    width: "100%",
    padding: "15px",
    background:
      "linear-gradient(135deg, #ff2f7d 0%, #ff5fa2 100%)",
    color: "#fff",
    borderRadius: "14px",
    fontSize: "16px",
    fontWeight: "700",
  },
  footerText: { marginTop: "14px", fontSize: "12px", color: "#777" },
};
