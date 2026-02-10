import { useState, useEffect } from "react";
import api from "../services/api";

function Chat() {
  const [messages, setMessages] = useState(() => {
  const saved = localStorage.getItem("chat_history");
  return saved ? JSON.parse(saved) : [];
});

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  // ✅ SAVE CHAT HISTORY ON EVERY CHANGE
  useEffect(() => {
    localStorage.setItem("chat_history", JSON.stringify(messages));
  }, [messages]);

  // ---------------- DOCUMENT UPLOAD ----------------
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login again");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setUploadMessage("");

    try {
      const res = await api.post("/documents/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setUploadMessage(
        `Document uploaded successfully (${res.data.total_chunks} chunks)`
      );

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Document indexed. You can now ask questions about it.",
        },
      ]);
    } catch (err) {
      setUploadMessage("Document upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ---------------- CHAT ----------------
  const sendMessage = async () => {
    if (!input.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Not authenticated. Please login again." },
      ]);
      return;
    }

    if (!uploadMessage) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Please upload a document before asking questions.",
        },
      ]);
      return;
    }

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post(
        "/chat",
        { question: userMessage.text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: res.data.answer },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Invalid request format" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const summarizeDocument = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login again");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post(
        "/documents/summarize",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `📄 Document Summary:\n\n${res.data.summary}`,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Failed to summarize document." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <h2>Enterprise AI Chatbot</h2>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
          style={styles.logout}
        >
          Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div style={styles.main}>
        {/* SIDEBAR */}
        <div style={styles.sidebar}>
          <h3>Documents</h3>
          <input type="file" accept=".pdf" onChange={handleFileUpload} />
          {uploading && <p>Uploading…</p>}
          {uploadMessage && <p>{uploadMessage}</p>}

          {uploadMessage && (
            <button onClick={summarizeDocument}>
              Summarize Document
            </button>
          )}
        </div>

        {/* CHAT AREA */}
        <div style={styles.chatArea}>
          <div style={styles.chatBox}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  ...styles.message,
                  alignSelf:
                    msg.sender === "user" ? "flex-end" : "flex-start",
                  background:
                    msg.sender === "user"
                      ? "#2563eb"
                      : "#1f2937",
                  color: "#fff",
                }}
              >
                {msg.text}
              </div>
            ))}
            {loading && <p style={{ color: "#9ca3af" }}>Thinking…</p>}
          </div>

          <div style={styles.inputBox}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something about the document…"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              style={styles.textInput}
            />
            <button onClick={sendMessage} style={styles.sendBtn}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#020617",
    color: "#fff",
    fontFamily: "Segoe UI, sans-serif",
  },

  header: {
    padding: "16px 24px",
    background: "#020617",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #1e293b",
  },

  logout: {
    background: "#dc2626",
    border: "none",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  main: {
    flex: 1,
    display: "grid",
    gridTemplateColumns: "280px 1fr",
  },

  sidebar: {
    padding: "20px",
    background: "#020617",
    borderRight: "1px solid #1e293b",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  chatArea: {
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    background: "#020617",
  },

  chatBox: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    overflowY: "auto",
    paddingRight: "10px",
  },

  message: {
    padding: "12px 16px",
    borderRadius: "14px",
    maxWidth: "70%",
    fontSize: "14px",
    lineHeight: "1.6",
  },

  inputBox: {
    display: "flex",
    gap: "10px",
    marginTop: "14px",
  },

  textInput: {
    flex: 1,
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
  },

  sendBtn: {
    padding: "14px 20px",
    borderRadius: "10px",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
  },
};

export default Chat;
