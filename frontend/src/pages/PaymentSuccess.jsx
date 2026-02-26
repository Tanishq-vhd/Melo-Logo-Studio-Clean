import { useNavigate } from "react-router-dom";
export default function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.checkIcon}>✓</div>

        <h1 style={styles.title}>Premium activated</h1>

        <div style={styles.emoji}>🎉</div>

        <p style={styles.subtitle}>
          Your payment was successful. You can now create unlimited logos.
        </p>

        <button
          style={styles.button}
          onClick={() => navigate("/melostudio")}
        >
          Create my first logo
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    backgroundColor: "#f3e6ea",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    backgroundColor: "#ffffff",
    padding: "50px 40px",
    borderRadius: "20px",
    width: "400px",
    textAlign: "center",
    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
  },

  checkIcon: {
    width: "50px",
    height: "50px",
    backgroundColor: "#28c76f",
    borderRadius: "10px",
    color: "white",
    fontSize: "28px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto 20px auto",
  },

  title: {
    fontSize: "36px",
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: "10px",
  },

  emoji: {
    fontSize: "30px",
    marginBottom: "15px",
  },

  subtitle: {
    color: "#6b7280",
    fontSize: "16px",
    marginBottom: "30px",
  },

  button: {
    backgroundColor: "#e84393",
    color: "white",
    border: "none",
    padding: "14px 28px",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "0.3s",
  },
};