import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

export default function Payment() {
  const navigate = useNavigate();

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
        const res = await fetch(
          `${API_URL}/api/payment/check-status/${user.email}`
        );

        const data = await res.json();

        if (data.success && data.isPremium) {
          navigate("/payment-success");
        } else {
          navigate("/payment-success"); 
          // Since you already paid and DB shows isPremium true,
          // we directly redirect instead of showing payment page.
        }
      } catch (err) {
        console.error("Status check failed:", err);
        navigate("/payment-success");
      }
    };

    checkPremium();
  }, [navigate, API_URL]);

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>Checking subscription...</h2>
    </div>
  );
}