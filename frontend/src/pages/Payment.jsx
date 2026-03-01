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
        const firebaseToken = await user.getIdToken();

        const res = await fetch(
          `${API_URL}/api/payment/check-status`,
          {
            headers: {
              Authorization: `Bearer ${firebaseToken}`,
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
      const user = auth.currentUser;
      if (!user) {
        navigate("/signin");
        return;
      }

      const firebaseToken = await user.getIdToken();

      // Create order
      const orderRes = await fetch(
        `${API_URL}/api/payment/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${firebaseToken}`,
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
                Authorization: `Bearer ${firebaseToken}`,
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
    <div style={{ background: "#fdf7fb", minHeight: "100vh", padding: "60px 20px" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
        <h1 style={{ fontSize: "42px", marginBottom: "20px" }}>
          Unlock your professional brand kit
        </h1>

        <p style={{ fontSize: "18px", color: "#555", marginBottom: "40px" }}>
          Get unlimited variations, full commercial rights, and files optimized
          for every platform.
        </p>

        <div style={{ textAlign: "left", marginBottom: "40px" }}>
          <p>✔ Unlimited logo variations</p>
          <p>✔ Full commercial license</p>
          <p>✔ All file formats included (PNG, SVG, PDF)</p>
        </div>

        <div
          style={{
            border: "1px solid #f5c6d6",
            borderRadius: "12px",
            padding: "30px",
            marginBottom: "30px",
            background: "white",
          }}
        >
          <h2>Premium Access</h2>
          <h1 style={{ fontSize: "36px" }}>₹299 / month</h1>
          <p>Cancel anytime</p>
        </div>

        <button
          onClick={handlePayment}
          style={{
            width: "100%",
            padding: "16px",
            fontSize: "18px",
            backgroundColor: "#ff4d94",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          Create my first logo
        </button>

        <p style={{ marginTop: "15px", color: "#777" }}>
          Secure payment • Cancel anytime
        </p>
      </div>
    </div>
  );
}