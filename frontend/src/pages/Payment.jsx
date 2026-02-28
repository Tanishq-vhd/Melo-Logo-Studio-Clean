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
        const res = await fetch(
          `${API_URL}/api/payment/check-status/${user.email}`
        );

        const data = await res.json();

        if (data.success && data.isPremium) {
          // ✅ Only redirect if premium
          navigate("/payment-success");
        } else {
          // ❌ DO NOTHING
          // Let payment page render normally
          setLoading(false);
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

  // 🔥 If not premium, show actual payment UI here
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>Upgrade to Premium</h2>
      <p>Please complete payment to continue.</p>
    </div>
  );
}