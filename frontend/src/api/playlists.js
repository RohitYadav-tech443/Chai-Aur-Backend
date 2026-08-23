import API from "./axios.js";

export const createPlaylist = async (payload) => {
  const { data } = await API.post("/playlist", payload);
  return data;
};

export const getUserPlaylists = async (userId) => {
  const { data } = await API.get(`/playlist/user/${userId}`);
  return data;
};

export const getPlaylistById = async (playlistId) => {
  const { data } = await API.get(`/playlist/${playlistId}`);
  return data;
};

export const addVideoToPlaylist = async (playlistId, videoId) => {
  const { data } = await API.patch(`/playlist/add/${videoId}/${playlistId}`);
  return data;
};

export const removeVideoFromPlaylist = async (playlistId, videoId) => {
  const { data } = await API.patch(`/playlist/remove/${videoId}/${playlistId}`);
  return data;
};

export const deletePlaylist = async (playlistId) => {
  const { data } = await API.delete(`/playlist/${playlistId}`);
  return data;
};

export const updatePlaylist = async (playlistId, payload) => {
  const { data } = await API.patch(`/playlist/${playlistId}`, payload);
  return data;
};
