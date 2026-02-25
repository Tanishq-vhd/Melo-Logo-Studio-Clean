import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/melostudio");
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "120px" }}>
      <h1>Payment Successful 🎉</h1>
      <p>Your premium access is now active.</p>
      <p>Redirecting you to MeloStudio...</p>
    </div>
  );
}