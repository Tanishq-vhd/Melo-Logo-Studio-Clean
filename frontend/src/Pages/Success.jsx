import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../services/api";

export default function Success() {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        const res = await getProfile();

        // ❌ invalid session
        if (
          res?.message === "Invalid or expired token" ||
          res?.message === "No token provided"
        ) {
          navigate("/signin");
          return;
        }

        // ❌ not paid (extra safety)
        const isPaid = localStorage.getItem("isPaid");
        if (isPaid !== "true") {
          navigate("/payment");
          return;
        }

        // ✅ auto redirect to AI tools
        setTimeout(() => {
          navigate("/ai-tools");
        }, 2000);
      } catch {
        navigate("/signin");
      }
    };

    verifyAccess();
  }, [navigate]);

  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff5f9",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "48px",
          borderRadius: "24px",
          textAlign: "center",
          boxShadow: "0 40px 80px rgba(0,0,0,0.12)",
          maxWidth: "420px",
        }}
      >
        <div style={{ fontSize: "48px" }}>✅</div>

        <h1 style={{ marginTop: "16px", fontSize: "26px" }}>
          Premium activated 🎉
        </h1>

        <p style={{ color: "#6b7280", marginTop: "12px" }}>
          Your payment was successful. Redirecting you to AI tools…
        </p>

        <button
          onClick={() => navigate("/ai-tools")}
          style={{
            marginTop: "28px",
            background: "#ec4899",
            color: "#fff",
            border: "none",
            borderRadius: "14px",
            padding: "16px 32px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Go to AI tools now
        </button>
      </div>
    </section>
  );
}
