import API from "./axios.js";

export const askAI = async ({
    question,
    videoId = null,
    threadId = null,
}) => {
    const { data } = await API.post("/ai/chat", {
        question,
        videoId,
        threadId,
    });

    return data;
};

export const uploadPDF = async ({ file, threadId }) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("threadId", threadId);

  const { data } = await API.post(
    "/ai/upload-pdf",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};