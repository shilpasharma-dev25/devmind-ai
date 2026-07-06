import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const createError = (data) => API.post("/errors", data);

export const getErrors = () => API.get("/errors");

export const deleteError = (id) => API.delete(`/errors/${id}`);

export const updateError = (id, data) =>
  API.put(`/errors/${id}`, data);


export const analyzeError = (data) =>
  API.post("/errors/analyze", data);