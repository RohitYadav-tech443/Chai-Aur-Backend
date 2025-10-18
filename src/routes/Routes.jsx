import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import HomePage from "./pages/HomePage";
import VideoPage from "./pages/VideoPage";
import UploadVideoPage from "./pages/UploadVideoPage";
import ProfilePage from "./pages/ProfilePage";
import PlaylistPage from "./pages/PlaylistPage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

// Optional: simple auth check (replace with your auth logic)
const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={isAuthenticated() ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/video/:id"
          element={isAuthenticated() ? <VideoPageWrapper /> : <Navigate to="/login" />}
        />
        <Route
          path="/upload"
          element={isAuthenticated() ? <UploadVideoPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={isAuthenticated() ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/playlists"
          element={isAuthenticated() ? <PlaylistPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/dashboard"
          element={isAuthenticated() ? <DashboardPage /> : <Navigate to="/login" />}
        />

        {/* Catch all unmatched routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

// Wrapper for VideoPage to extract :id param
import { useParams } from "react-router-dom";
function VideoPageWrapper() {
  const { id } = useParams();
  return <VideoPage videoId={id} />;
}
