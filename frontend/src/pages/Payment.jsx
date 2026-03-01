import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

export default function Payment() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const API_URL =
    process.env.REACT_APP_API_URL || "https://melo-logo-studio.onrender.com";

  useEffect(() => {
    const checkPremium = async () => {
      const user = auth.currentUser;

      if (!user) {
        navigate("/signin");
        return;
      }

      try {
        const token = await user.getIdToken();

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
          // Already premium
          navigate("/success");
        } else {
          // Not premium → show payment page
          setLoading(false);
        }

      } catch (err) {
        console.error("Status check failed:", err);
        setLoading(false);
      }
    };

    checkPremium();
  }, [navigate, API_URL]);

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Checking subscription...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>Premium Plan - ₹299</h2>
      <p>Unlock unlimited logo generation.</p>

      {/* Add Razorpay button here */}
      <button
        style={{
          padding: "12px 24px",
          backgroundColor: "#ff4d94",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "16px",
        }}
        onClick={() => {
          // Trigger Razorpay flow here
          console.log("Start Razorpay Payment");
        }}
      >
        Pay ₹299
      </button>
    </div>
  );
}