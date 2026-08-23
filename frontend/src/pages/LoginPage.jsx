import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getApiErrorMessage } from "../utils/helpers.js";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const successMessage = location.state?.message;

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login({
        email: form.email || undefined,
        username: form.username || undefined,
        password: form.password,
      });
      navigate("/");
    } catch (err) {
      setError(getApiErrorMessage(err, "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Welcome back</h1>
        <p className="muted">Sign in to continue to ChaiTube.</p>

        {successMessage && <p className="success-text">{successMessage}</p>}

        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
          />
        </label>

        <label>
          Username
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="username"
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

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>

        <p className="auth-footer">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
