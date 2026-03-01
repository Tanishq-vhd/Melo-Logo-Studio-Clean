import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

export default function Payment() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const API_URL =
    process.env.REACT_APP_API_URL || "https://melo-logo-studio.onrender.com";

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
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
          navigate("/success");
        } else {
          setLoading(false); // Show payment UI
        }

      } catch (err) {
        console.error("Status check failed:", err);
        setLoading(false);
      }
    });

    return () => unsubscribe();
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
          console.log("Trigger Razorpay here");
        }}
      >
        Pay ₹299
      </button>
    </div>
  );
}