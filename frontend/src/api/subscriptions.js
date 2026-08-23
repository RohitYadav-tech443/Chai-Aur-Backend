import API from "./axios.js";

export const toggleSubscription = async (channelId) => {
  const { data } = await API.post(`/subscriptions/c/${channelId}`);
  return data;
};

export const getSubscribedChannels = async (channelId) => {
  const { data } = await API.get(`/subscriptions/c/${channelId}`);
  return data;
};

export const getChannelSubscribers = async (subscriberId) => {
  const { data } = await API.get(`/subscriptions/u/${subscriberId}`);
  return data;
};
