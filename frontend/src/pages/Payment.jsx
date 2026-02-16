import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Payment() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;
  const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY;

  const handlePayment = async () => {
    if (loading) return;

    if (!API_URL || !RAZORPAY_KEY) {
      alert("Payment configuration error.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    if (!window.Razorpay) {
      alert("Payment system not loaded. Refresh the page.");
      return;
    }

    try {
      setLoading(true);

      // 🔹 Create Order from backend
      const orderRes = await fetch(
        `${API_URL}/api/payment/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        }
      );

      if (!orderRes.ok) {
        setLoading(false);
        alert("Unable to initiate payment.");
        return;
      }

      const order = await orderRes.json();

      if (!order?.id) {
        setLoading(false);
        alert("Invalid payment order.");
        return;
      }

      // 🔹 Razorpay Checkout
      const options = {
        key: RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name: "Melo Studio",
        description: "Premium Access",
        order_id: order.id,

        handler: async function (response) {
          try {
            const verifyRes = await fetch(
              `${API_URL}/api/payment/verify-payment`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              }
            );

            if (!verifyRes.ok) {
              setLoading(false);
              alert("Payment verification failed.");
              return;
            }

            localStorage.setItem("isPaid", "true");
            navigate("/ai-tools");

          } catch (err) {
            setLoading(false);
            alert("Verification failed.");
          }
        },

        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },

        theme: {
          color: "#ff2f7d",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      setLoading(false);
      alert("Payment failed. Please try again.");
    }
  };

 return (
  <div style={styles.page}>
    <div style={styles.container}>
      <p style={styles.topText}>✨ Your logo is ready to download</p>

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
          opacity: loading ? 0.90:1,
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


const styles = {
  page: {
    minHeight: "110",
    background:
      "linear-gradient(180deg, #ffffff 0%, #fff5fa 60%, #ffffff 100%)",
    display: "flex",
    justifyContent: "center",
    padding: "40px 16px",
  },
  container: {
    width: "100%",
    maxWidth: "430px",
    background: "#ffffff",
    borderRadius: "18px",
    padding: "30px 24px",
    textAlign: "center",
    boxShadow:
      "0 25px 50px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
  },
  topText: {
    color: "#ff3d8b",
    fontWeight: "600",
    marginBottom: "12px",
  },
  heading: {
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "10px",
  },
  subText: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "22px",
  },
  features: {
    textAlign: "left",
    marginBottom: "24px",
  },
  featureItem: {
    display: "flex",
    gap: "10px",
    marginBottom: "14px",
  },
  check: {
    color: "#ff3d8b",
    fontWeight: "700",
  },
  featureTitle: {
    fontWeight: "600",
    fontSize: "14px",
  },
  featureDesc: {
    fontSize: "13px",
    color: "#777",
  },
  priceCard: {
    borderRadius: "14px",
    padding: "18px",
    background: "#fff7fb",
    border: "1.5px solid #ffd3e6",
    marginBottom: "24px",
  },
  priceHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  plan: {
    fontWeight: "600",
  },
  badge: {
    background: "#ffe8f1",
    color: "#ff3d8b",
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "11px",
  },
  price: {
    fontSize: "22px",
    fontWeight: "700",
  },
  per: {
    fontSize: "14px",
    color: "#777",
  },
  cancel: {
    fontSize: "12px",
    color: "#888",
  },
  cta: {
    width: "100%",
    padding: "15px",
    background:
      "linear-gradient(135deg, #ff2f7d 0%, #ff5fa2 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    fontSize: "16px",
    fontWeight: "700",
  },
  footerText: {
    marginTop: "14px",
    fontSize: "12px",
    color: "#777",
  },
};
