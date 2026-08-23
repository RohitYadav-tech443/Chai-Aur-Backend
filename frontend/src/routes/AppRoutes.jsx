import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import DashboardPage from "../pages/DashboardPage.jsx";
import HomePage from "../pages/HomePage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import PlaylistPage from "../pages/PlaylistPage.jsx";
import ProfilePage from "../pages/ProfilePage.jsx";
import SignUpPage from "../pages/SignUpPage.jsx";
import UploadVideoPage from "../pages/UploadVideoPage.jsx";
import VideoPage from "../pages/VideoPage.jsx";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <HomePage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/video/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <VideoPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Layout>
                <UploadVideoPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <ProfilePage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/playlists"
          element={
            <ProtectedRoute>
              <Layout>
                <PlaylistPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
