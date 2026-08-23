import API from "./axios.js";

export const getVideoComments = async (videoId, { page = 1, limit = 10 } = {}) => {
  const { data } = await API.get(`/comments/${videoId}`, {
    params: { page, limit },
  });
  return data;
};

export const addComment = async (videoId, comment) => {
  const { data } = await API.post(`/comments/${videoId}`, { comment });
  return data;
};

export const updateComment = async (commentId, comment) => {
  const { data } = await API.patch(`/comments/c/${commentId}`, { comment });
  return data;
};

export const deleteComment = async (commentId) => {
  const { data } = await API.delete(`/comments/c/${commentId}`);
  return data;
};
