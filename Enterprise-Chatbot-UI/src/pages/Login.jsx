import { useState } from "react";
import api from "../services/api";

function Login({ onOtpRequired }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/login", {
        email,
        password,
      });

    // STORE EMAIL FOR OTP VERIFICATION STEP
    localStorage.setItem("otp_email", email);

    // MOVE TO OTP SCREEN
    onOtpRequired(email);
    
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.overlay} />

      <div style={styles.content}>
        {/* LEFT TEXT */}
        <div style={styles.hero}>
          <h1 style={styles.brand}>Enterprise Chatbot</h1>
          <p style={styles.tagline}>
            Securely upload enterprise documents, generate summaries,
            and ask intelligent questions — instantly.
          </p>
        </div>

        {/* LOGIN CARD */}
        <div style={styles.card}>
          <h2 style={styles.loginTitle}>Sign in</h2>

          <form onSubmit={handleLogin} style={styles.form}>
            <input
              type="email"
              placeholder="Corporate Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                ...(loading ? styles.buttonLoading : {}),
              }}
            >
              {loading ? "Authenticating…" : "Login"}
            </button>

            {error && <p style={styles.error}>{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  /* FULL SCREEN BACKGROUND */
  page: {
    width: "100vw",
    height: "100vh",
    position: "relative",
    background:
      "radial-gradient(circle at top left, #0f2027, #020617 70%)",
    fontFamily: "Segoe UI, sans-serif",
    overflow: "hidden",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(120deg, rgba(15,23,42,0.85), rgba(2,6,23,0.95))",
  },

  /* CONTENT LAYER */
  content: {
    position: "relative",
    zIndex: 1,
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 8vw",
  },

  /* HERO TEXT */
  hero: {
    maxWidth: "520px",
    color: "#fff",
  },
  brand: {
    fontSize: "52px",
    fontWeight: "800",
    marginBottom: "24px",
  },
  tagline: {
    fontSize: "18px",
    lineHeight: "1.7",
    color: "#cbd5f5",
  },

  /* LOGIN CARD */
  card: {
    width: "420px",
    padding: "36px",
    background: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
  },

  loginTitle: {
    textAlign: "center",
    marginBottom: "24px",
    fontWeight: "600",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  input: {
    padding: "14px",
    fontSize: "14px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    outline: "none",
  },

  button: {
    padding: "14px",
    fontSize: "15px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, #2563eb, #1e40af)",
    color: "#fff",
    cursor: "pointer",
    boxShadow: "0 10px 24px rgba(37,99,235,0.45)",
  },

  buttonLoading: {
    opacity: 0.85,
  },

  error: {
    color: "#dc2626",
    fontSize: "13px",
    textAlign: "center",
    marginTop: "8px",
  },
};

export default Login;
