import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get order details from URL query params
    const params = new URLSearchParams(location.search);
    const orderId = params.get("orderId");
    const amount = Number(params.get("amount")) || 0;

    if (orderId && window.fbq) {
      const eventId = `purchase_${orderId}`;

      // Prevent duplicate firing on refresh
      const alreadySent = localStorage.getItem(eventId);

      if (!alreadySent) {
        window.fbq("track", "Purchase", {
          value: amount,
          currency: "INR",
          content_ids: [orderId],
          content_type: "product",
          num_items: 1,
          eventID: eventId, // Important for CAPI deduplication
        });

        localStorage.setItem(eventId, "true");
      }
    }

    const timer = setTimeout(() => {
      navigate("/melostudio");
    }, 3000);

    return () => clearTimeout(timer);

  }, [navigate, location.search]);

  return (
    <div style={{ textAlign: "center", marginTop: "120px" }}>
      <h1>Payment Successful 🎉</h1>
      <p>Your premium access is now active.</p>
      <p>Redirecting you to MeloStudio...</p>
    </div>
  );
}