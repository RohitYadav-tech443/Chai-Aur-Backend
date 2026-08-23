import API from "./axios.js";

export const toggleVideoLike = async (videoId) => {
  const { data } = await API.post(`/likes/toggle/v/${videoId}`);
  return data;
};

export const toggleCommentLike = async (commentId) => {
  const { data } = await API.post(`/likes/toggle/c/${commentId}`);
  return data;
};

export const getLikedVideos = async () => {
  const { data } = await API.get("/likes/videos");
  return data;
};
