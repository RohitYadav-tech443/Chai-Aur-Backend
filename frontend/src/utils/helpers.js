export const getVideoUrl = (video) =>
  video?.video ||
  video?.videoFile?.url ||
  video?.videoFile ||
  video?.vedio ||
  "";

export const getThumbnailUrl = (video) =>
  video?.thumbnail ||
  video?.video ||
  video?.videoFile?.url ||
  video?.videoFile ||
  video?.vedio ||
  "";

export const getApiErrorMessage = (error, fallback = "Something went wrong") => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
};

export const formatViews = (views = 0) => {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M views`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K views`;
  return `${views} views`;
};
