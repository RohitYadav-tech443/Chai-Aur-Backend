import API from "./axios.js";

export const getChannelStats = async () => {
  const { data } = await API.get("/dashboard/stats");
  return data;
};

export const getChannelVideos = async () => {
  const { data } = await API.get("/dashboard/videos");
  return data;
};
