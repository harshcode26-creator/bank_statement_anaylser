import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const uploadFiles = async (files) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  const res = await API.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const getUploadById = async (id) => {
  const res = await API.get(`/upload/${id}`);

  return res.data;
};

export const getUploads = async () => {
  const res = await API.get("/upload");

  return res.data;
};

export const getTransactions = async (id, params = {}) => {
  const res = await API.get(`/upload/${id}/transactions`, { params });

  return res.data;
};

export const updateUpload = async (id, data) => {
  const res = await API.patch(`/upload/${id}`, data);

  return res.data;
};

export const deleteUpload = async (id) => {
  const res = await API.delete(`/upload/${id}`);

  return res.data;
};
