import { useEffect, useState } from "react";
import {
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
} from "../api/users.js";
import { useAuth } from "../context/AuthContext.jsx";
import { getApiErrorMessage } from "../utils/helpers.js";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getCurrentUser();
        const currentUser = response.data;
        setUser(currentUser);
        setForm({
          fullname: currentUser.fullname || "",
          email: currentUser.email || "",
        });
      } catch (err) {
        setError(getApiErrorMessage(err, "Failed to load profile"));
      }
    };

    loadProfile();
  }, [setUser]);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleAccountUpdate = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await updateAccountDetails(form);
      setUser(response.data);
      setMessage("Profile updated successfully");
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to update profile"));
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await updateUserAvatar(formData);
      setUser(response.data);
      setMessage("Avatar updated");
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to update avatar"));
    }
  };

  const handleCoverUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("coverImage", file);

    try {
      const response = await updateUserCoverImage(formData);
      setUser(response.data);
      setMessage("Cover image updated");
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to update cover image"));
    }
  };

  return (
    <section className="page page--narrow">
      <div className="profile-hero card">
        {user?.coverImage ? (
          <img src={user.coverImage} alt="Cover" className="profile-hero__cover" />
        ) : (
          <div className="profile-hero__cover profile-hero__cover--empty" />
        )}

        <div className="profile-hero__content">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.username} className="avatar avatar--lg" />
          ) : (
            <div className="avatar avatar--lg avatar--empty" />
          )}
          <div>
            <h1>{user?.fullname}</h1>
            <p className="muted">@{user?.username}</p>
          </div>
        </div>
      </div>

      <form className="card form-card" onSubmit={handleAccountUpdate}>
        <h2>Account details</h2>

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
          Update avatar
          <input type="file" accept="image/*" onChange={handleAvatarUpload} />
        </label>

        <label>
          Update cover image
          <input type="file" accept="image/*" onChange={handleCoverUpload} />
        </label>

        {message && <p className="success-text">{message}</p>}
        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="btn btn--primary" disabled={loading}>
          {loading ? "Saving..." : "Save changes"}
        </button>
      </form>
    </section>
  );
}
