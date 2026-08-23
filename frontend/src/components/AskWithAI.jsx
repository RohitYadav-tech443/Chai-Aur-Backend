import { useState } from "react";
import { askAI, uploadPDF } from "../api/ai.js";

export default function AskWithAI({ videoId, onClose }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // PDF states
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingPDF, setUploadingPDF] = useState(false);
  const [pdfMessage, setPdfMessage] = useState("");

  // One conversation thread for this AI panel
  const [threadId] = useState(() => crypto.randomUUID());

  // ============================
  // PDF Upload
  // ============================

  const handlePDFUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // Make sure it is a PDF
    if (file.type !== "application/pdf") {
      setError("Please select a PDF file.");
      return;
    }

    setSelectedFile(file);
    setPdfMessage("");
    setError("");

    try {
      setUploadingPDF(true);

      const response = await uploadPDF({
        file,
        threadId,
      });

      const message =
        response?.data?.message ||
        response?.message ||
        "PDF uploaded and indexed successfully.";

      setPdfMessage(message);

    } catch (err) {
      console.error("PDF UPLOAD ERROR:", err);

      const message =
        err.response?.data?.message ||
        "Failed to upload and process the PDF.";

      setError(message);
      setPdfMessage("");
    } finally {
      setUploadingPDF(false);
    }
  };

  // ============================
  // Ask AI
  // ============================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!question.trim() || loading) {
      return;
    }

    const userQuestion = question.trim();

    setQuestion("");
    setError("");

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userQuestion,
      },
    ]);

    setLoading(true);

    try {
      const response = await askAI({
        question: userQuestion,
        videoId,
        threadId,
      });

      const answer =
        response?.data?.answer ||
        response?.answer ||
        "I couldn't generate a response.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: answer,
        },
      ]);
    } catch (err) {
      console.error("AI ERROR:", err);

      const message =
        err.response?.data?.message ||
        "Something went wrong while contacting the AI.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ask-ai card">

      {/* ============================
          Header
      ============================ */}

      <div className="ask-ai__header">
        <h2>Ask with AI</h2>

        {onClose && (
          <button
            type="button"
            className="btn btn--ghost"
            onClick={onClose}
          >
            Close
          </button>
        )}
      </div>

      {/* ============================
          PDF Upload
      ============================ */}

      <div className="ask-ai__pdf">

        <h3>📄 Upload Lecture Notes</h3>

        <p className="muted">
          Upload a PDF to ask questions about its contents.
        </p>

        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={handlePDFUpload}
          disabled={uploadingPDF || loading}
        />

        {selectedFile && (
          <p className="muted">
            Selected: <strong>{selectedFile.name}</strong>
          </p>
        )}

        {uploadingPDF && (
          <p className="muted">
            Processing PDF...
          </p>
        )}

        {pdfMessage && (
          <p className="success-text">
            {pdfMessage}
          </p>
        )}

      </div>

      {/* ============================
          Chat Messages
      ============================ */}

      <div className="ask-ai__messages">

        {messages.length === 0 && (
          <p className="muted">
            Ask anything about your doubt.
          </p>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`ask-ai__message ask-ai__message--${message.role}`}
          >
            <strong>
              {message.role === "user" ? "You" : "AI"}
            </strong>

            <p>{message.content}</p>
          </div>
        ))}

        {loading && (
          <div className="ask-ai__message ask-ai__message--assistant">
            <strong>AI</strong>
            <p>Thinking...</p>
          </div>
        )}

        {error && (
          <p className="error-text">
            {error}
          </p>
        )}

      </div>

      {/* ============================
          Ask Question
      ============================ */}

      <form
        className="ask-ai__form"
        onSubmit={handleSubmit}
      >

        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask your doubt..."
          rows={3}
          disabled={loading || uploadingPDF}
        />

        <button
          type="submit"
          className="btn btn--primary"
          disabled={
            loading ||
            uploadingPDF ||
            !question.trim()
          }
        >
          {loading ? "Asking..." : "Ask AI"}
        </button>

      </form>

    </div>
  );
}