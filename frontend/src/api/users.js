import API from "./axios.js";

export const registerUser = async (formData) => {
  const { data } = await API.post("/users/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const loginUser = async (credentials) => {
  const { data } = await API.post("/users/login", credentials);
  return data;
};

export const logoutUser = async () => {
  const { data } = await API.post("/users/logout");
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await API.get("/users/current-user");
  return data;
};

export const updateAccountDetails = async (details) => {
  const { data } = await API.patch("/users/update-account", details);
  return data;
};

export const updateUserAvatar = async (formData) => {
  const { data } = await API.patch("/users/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const updateUserCoverImage = async (formData) => {
  const { data } = await API.patch("/users/cover-Image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const getUserChannelProfile = async (username) => {
  const { data } = await API.get(`/users/c/${username}`);
  return data;
};

export const getWatchHistory = async () => {
  const { data } = await API.get("/users/history");
  return data;
};

export const changePassword = async (payload) => {
  const { data } = await API.post("/users/change-password", payload);
  return data;
};
