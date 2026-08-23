import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getApiErrorMessage } from "../utils/helpers.js";

export default function SignUpPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    username: "",
    password: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [error, setError] = useState("");
  const [accountExists, setAccountExists] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    setError("");
    setAccountExists(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");
    setAccountExists(false);

    if (!avatar) {
      setError("Avatar image is required");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    formData.append("avatar", avatar);
    if (coverImage) formData.append("coverImage", coverImage);

    try {
      await register(formData);
      navigate("/login", {
        state: { message: "Account created successfully. Please login." },
      });
    } catch (err) {
      const message = getApiErrorMessage(err, "Registration failed");
      setError(message);
      if (err?.response?.status === 409) {
        setAccountExists(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card auth-card--wide" onSubmit={handleSubmit}>
        <h1>Create account</h1>
        <p className="muted">Join the VedioTube video platform.</p>

        <div className="form-grid">
          <label>
            Full name
            <input
              type="text"
              name="fullname"
              value={form.fullname}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Username
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Avatar
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setAvatar(event.target.files?.[0] || null)}
              required
            />
          </label>

          <label>
            Cover image (optional)
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setCoverImage(event.target.files?.[0] || null)}
            />
          </label>
        </div>

        {error && (
          <div className="alert alert--error">
            <p className="error-text">{error}</p>
            {accountExists && (
              <p>
                Already registered? <Link to="/login">Go to login</Link>
              </p>
            )}
          </div>
        )}

        <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
          {loading ? "Creating account..." : "Sign up"}
        </button>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
