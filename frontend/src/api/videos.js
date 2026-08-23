import API from "./axios.js";

export const getAllVideos = async ({
  page = 1,
  limit = 12,
  query = "",
  sortBy = "createdAt",
  sortType = "desc",
  userId = "",
} = {}) => {
  const params = { page, limit, query, sortBy, sortType };
  if (userId) params.userId = userId;
  const { data } = await API.get("/videos", { params });
  return data;
};

export const publishVideo = async (formData) => {
  const { data } = await API.post("/videos", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const getVideoById = async (videoId) => {
  const { data } = await API.get(`/videos/${videoId}`);
  return data;
};

export const updateVideo = async (videoId, formData) => {
  const { data } = await API.patch(`/videos/${videoId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteVideo = async (videoId) => {
  const { data } = await API.delete(`/videos/${videoId}`);
  return data;
};

export const togglePublishStatus = async (videoId) => {
  const { data } = await API.patch(`/videos/toggle/publish/${videoId}`);
  return data;
};
