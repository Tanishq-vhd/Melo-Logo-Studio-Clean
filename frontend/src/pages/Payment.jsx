import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

export default function Payment() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const API_URL =
    process.env.REACT_APP_API_URL || "https://melo-logo-studio.onrender.com";

  /* ================= CHECK PREMIUM ================= */
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate("/signin");
        return;
      }

      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${API_URL}/api/payment/check-status`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (data.success && data.isPremium) {
          navigate("/success");
        } else {
          setLoading(false);
        }

      } catch (err) {
        console.error("Status check failed:", err);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate, API_URL]);

  /* ================= RAZORPAY ================= */
  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");

      const orderRes = await fetch(
        `${API_URL}/api/payment/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const orderData = await orderRes.json();

      if (!orderData.id) {
        alert("Order creation failed");
        return;
      }

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: "INR",
        name: "Melo Studio",
        description: "Premium Subscription",
        order_id: orderData.id,
        handler: async function (response) {
          const verifyRes = await fetch(
            `${API_URL}/api/payment/verify-payment`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(response),
            }
          );

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            navigate("/success");
          } else {
            alert("Payment verification failed");
          }
        },
        theme: {
          color: "#ff4d94",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed");
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        Checking subscription...
      </div>
    );
  }

  /* ================= PREMIUM DESIGN UI ================= */
  return (
    <div className="payment-container" style={{ padding: "60px 20px", textAlign: "center" }}>
      <h1>Unlock your professional brand kit</h1>
      <p>
        Get unlimited variations, full commercial rights, and files optimized
        for every platform.
      </p>

      <div style={{ margin: "30px 0" }}>
        <h2>Premium Access</h2>
        <h1>₹299 / month</h1>
        <p>Cancel anytime</p>
      </div>

      <button
        onClick={handlePayment}
        style={{
          padding: "14px 28px",
          backgroundColor: "#ff4d94",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        Pay ₹299
      </button>
    </div>
  );
}