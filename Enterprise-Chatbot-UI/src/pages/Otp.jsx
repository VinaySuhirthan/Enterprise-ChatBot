import { useState } from "react";
import api from "../services/api";

function Otp({ email, onSuccess }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/verify-otp", {
        email,
        otp,
      });

      localStorage.setItem("token", res.data.access_token);
       // OTP FLOW IS DONE — CLEAN UP
      localStorage.removeItem("otp_email");
      onSuccess();
    } catch (err) {
      setError(
        err.response?.data?.detail || "OTP verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.overlay} />

      <div style={styles.content}>
        {/* LEFT INFO PANEL */}
        <div style={styles.hero}>
          <h1 style={styles.brand}>Verify Your Identity</h1>
          <p style={styles.tagline}>
            A one-time password has been sent to
            <br />
            <strong>{email}</strong>
          </p>
        </div>

        {/* OTP CARD */}
        <div style={styles.card}>
          <h2 style={styles.title}>OTP Verification</h2>

          <form onSubmit={handleVerify} style={styles.form}>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
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
              {loading ? "Verifying…" : "Verify OTP"}
            </button>

            {error && <p style={styles.error}>{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  /* FULL SCREEN */
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

  content: {
    position: "relative",
    zIndex: 1,
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 8vw",
  },

  /* LEFT TEXT */
  hero: {
    maxWidth: "520px",
    color: "#ffffff",
  },
  brand: {
    fontSize: "48px",
    fontWeight: "800",
    marginBottom: "20px",
  },
  tagline: {
    fontSize: "18px",
    lineHeight: "1.7",
    color: "#cbd5f5",
  },

  /* CARD */
  card: {
    width: "420px",
    padding: "36px",
    background: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
  },

  title: {
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
    fontSize: "15px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    outline: "none",
    letterSpacing: "3px",
    textAlign: "center",
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

export default Otp;
