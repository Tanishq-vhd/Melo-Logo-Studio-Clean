import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase"; // Ensure this points to your firebase config

export default function Payment() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Use the Live Render URL
  const API_URL_RAW = process.env.REACT_APP_API_URL || "https://melo-logo-studio.onrender.com";
  const API_URL = API_URL_RAW.replace(/\/$/, "");
  const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY || "rzp_live_SCtpMpqcflvzA0";

  const handlePayment = async () => {
    if (loading) return;

    try {
      setLoading(true);

      // Verify Firebase Auth
      await new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          unsubscribe();
          resolve();
        });
      });

      const user = auth.currentUser;
      if (!user) {
        navigate("/signin");
        return;
      }

      const token = await user.getIdToken(true);

      // 1️⃣ Create Order
      const orderRes = await fetch(`${API_URL}/api/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!orderRes.ok) throw new Error("Order creation failed");
      const order = await orderRes.json();

      // 2️⃣ Razorpay Logic
      const options = {
        key: RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name: "Melo Logo Studio",
        order_id: order.id,
        handler: async function (response) {
  try {
    // 1️⃣ Verify the payment with your backend
    const verifyRes = await fetch(`${API_URL}/api/payment/verify-payment`,  {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: user.email,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature
      }),
    });

    const data = await verifyRes.json();

    if (verifyRes.ok && data.success) {
      // 2️⃣ SUCCESS LOGIC: Update local storage
      // We use 'isPaid' here to match your App.jsx requirement
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      userData.isPaid = true; 
      localStorage.setItem("user", JSON.stringify(userData));
      
      console.log("✅ Payment Verified. Upgrading user...");

      // 3️⃣ Redirect to the studio dashboard
      navigate("/melostudio"); 
    } else {
      alert(data.message || "Payment verification failed.");
      setLoading(false);
    }
  } catch (err) {
    console.error("Verification error:", err);
    alert("Server error during verification. Please contact support.");
    setLoading(false);
  }
},
        prefill: { email: user.email },
        theme: { color: "#ff2f7d" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      alert("Error starting payment.");
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.heading}>Unlock Melostudio</h1>
        <div style={styles.priceCard}>
          <div style={styles.price}>₹299 <span style={styles.per}>/ month</span></div>
        </div>
        <button 
          style={styles.cta} 
          onClick={handlePayment} 
          disabled={loading}
        >
          {loading ? "Processing..." : "Pay Now & Create Logo"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f9f9f9" },
  container: { width: "100%", maxWidth: "400px", background: "#fff", padding: "40px", borderRadius: "20px", textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" },
  heading: { fontSize: "24px", marginBottom: "20px" },
  priceCard: { background: "#fff0f6", padding: "20px", borderRadius: "10px", marginBottom: "30px" },
  price: { fontSize: "32px", fontWeight: "bold" },
  per: { fontSize: "16px", color: "#666" },
  cta: { width: "100%", padding: "15px", background: "#ff2f7d", color: "#fff", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }
};