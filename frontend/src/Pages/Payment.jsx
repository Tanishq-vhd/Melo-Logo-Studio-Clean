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
        <h1 style={styles.heading}>Unlock Premium Access</h1>
        <p style={styles.subText}>
          Get unlimited logos, full commercial rights, and all formats.
        </p>

        <div style={styles.priceCard}>
          <div style={styles.price}>₹299</div>
          <p style={styles.cancel}>One-time payment</p>
        </div>

        <button
          style={{
            ...styles.cta,
            opacity: loading ? 0.8 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? "Opening payment..." : "Pay ₹299"}
        </button>

        <p style={styles.footerText}>
          Secure payment • Cancel anytime
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "100%",
    maxWidth: "400px",
    background: "#ffffff",
    borderRadius: "16px",
    padding: "30px",
    textAlign: "center",
    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
  },
  heading: {
    fontSize: "22px",
    fontWeight: "700",
  },
  subText: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "20px",
  },
  priceCard: {
    background: "#fff5fa",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
  },
  price: {
    fontSize: "24px",
    fontWeight: "700",
  },
  cancel: {
    fontSize: "12px",
    color: "#777",
  },
  cta: {
    width: "100%",
    padding: "14px",
    background: "#ff2f7d",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600",
  },
  footerText: {
    marginTop: "14px",
    fontSize: "12px",
    color: "#777",
  },
};
