import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const createError = (data) => API.post("/errors", data);

export const getErrors = () => API.get("/errors");

export const deleteError = (id) => API.delete(`/errors/${id}`);

export const updateError = (id, data) =>
  API.put(`/errors/${id}`, data);


export const analyzeError = (id) =>
  API.post(`/errors/${id}/analyze`);