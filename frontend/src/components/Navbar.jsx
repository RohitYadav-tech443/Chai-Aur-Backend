import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar__brand">
        <Link to="/">ChaiTube</Link>
      </div>

      <nav className="navbar__links">
        {isAuthenticated && (
          <>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/upload">Upload</NavLink>
            <NavLink to="/playlists">Playlists</NavLink>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/profile">Profile</NavLink>
          </>
        )}
      </nav>

      <div className="navbar__actions">
        {isAuthenticated ? (
          <>
            {user?.avatar && (
              <img src={user.avatar} alt={user.username} className="avatar avatar--sm" />
            )}
            <span className="navbar__username">@{user?.username}</span>
            <button type="button" className="btn btn--ghost" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn--ghost">
              Login
            </Link>
            <Link to="/signup" className="btn btn--primary">
              Sign up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
