import axios from "axios";

// Base configuration for all API requests
const API = axios.create({
  baseURL: "http://localhost:8000/api", // ⬅️ Update if your backend uses a different base path
});

// Attach token for protected routes (if JWT is used)
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

/* ======================================================
   📹 Video API FUNCTIONS (matching your controller)
   ====================================================== */

// 1️⃣ Get all videos (with pagination, sorting, filtering, optional userId)
export const getAllVideos = async ({
  page = 1,
  limit = 10,
  query = "",
  sortBy = "createdAt",
  sortType = "desc",
  userId = "",
}) => {
  const params = { page, limit, query, sortBy, sortType };
  if (userId) params.userId = userId;
  const response = await API.get("/videos", { params });
  return response.data;
};

// 2️⃣ Publish (upload) a new video
export const publishVideo = async (formData) => {
  // formData should include title, description, and the video file
  const response = await API.post("/videos", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// 3️⃣ Get a video by ID
export const getVideoById = async (videoId) => {
  const response = await API.get(`/videos/${videoId}`);
  return response.data;
};

// 4️⃣ Update a video
export const updateVideo = async (videoId, formData) => {
  // formData can contain title, description, and optional new video file
  const response = await API.put(`/videos/${videoId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// 5️⃣ Delete a video
export const deleteVideo = async (videoId) => {
  const response = await API.delete(`/videos/${videoId}`);
  return response.data;
};

// 6️⃣ Toggle publish status (publish/unpublish)
export const togglePublishStatus = async (videoId) => {
  const response = await API.patch(`/videos/toggle/${videoId}`);
  return response.data;
};
