import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../services/api";

export default function Success() {
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    let timer;

    const verifyAccess = async () => {
      try {
        const res = await getProfile();

        // ❌ Invalid session
        if (
          res?.message === "Invalid or expired token" ||
          res?.message === "No token provided"
        ) {
          navigate("/signin");
          return;
        }

        // ❌ Payment not completed
        const isPaid = localStorage.getItem("isPaid");
        if (isPaid !== "true") {
          navigate("/payment");
          return;
        }

        // ✅ Start redirect animation
        setRedirecting(true);

        timer = setTimeout(() => {
          navigate("/melostudio");
        }, 2000);
      } catch (error) {
        navigate("/signin");
      }
    };

    verifyAccess();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f6eef2",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          padding: "60px 50px",
          borderRadius: "28px",
          textAlign: "center",
          width: "420px",
          boxShadow: "0 30px 80px rgba(0,0,0,0.08)",
        }}
      >
        {/* Green Check */}
        <div
          style={{
            width: "60px",
            height: "60px",
            background: "#34d399",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto",
            color: "#fff",
            fontSize: "30px",
            fontWeight: "bold",
          }}
        >
          ✓
        </div>

        {/* Title */}
        <h1
          style={{
            marginTop: "28px",
            fontSize: "36px",
            fontWeight: "700",
            color: "#111827",
            lineHeight: "1.2",
          }}
        >
          Premium
          <br />
          activated
        </h1>

        {/* Emoji */}
        <div style={{ fontSize: "28px", marginTop: "12px" }}>🎉</div>

        {/* Description */}
        <p
          style={{
            marginTop: "20px",
            color: "#6b7280",
            fontSize: "15px",
            lineHeight: "1.6",
          }}
        >
          Your payment was successful. You can now create unlimited logos.
        </p>

        {/* Redirect Text */}
        {redirecting && (
          <p
            style={{
              marginTop: "16px",
              fontSize: "14px",
              color: "#9ca3af",
            }}
          >
            Redirecting to MeloStudio...
          </p>
        )}

        {/* Spinner */}
        {redirecting && (
          <div
            style={{
              marginTop: "10px",
              width: "24px",
              height: "24px",
              border: "3px solid #ec4899",
              borderTop: "3px solid transparent",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          />
        )}

        {/* Button */}
        <button
          onClick={() => navigate("/melostudio")}
          style={{
            marginTop: "30px",
            background: "#ec4899",
            color: "#fff",
            border: "none",
            borderRadius: "16px",
            padding: "14px 28px",
            fontWeight: "600",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          Create my first logo
        </button>

        {/* Spinner Animation */}
        <style>
          {`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    </div>
  );
}