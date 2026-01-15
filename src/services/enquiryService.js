import axios from "axios";

const api = axios.create();

const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

export const fetchEnquiries = (params = {}) =>
  api.get("/api/enquiries", { params, headers: authHeader() });

export const createEnquiry = (payload) =>
  api.post("/api/enquiries", payload, { headers: authHeader() });

export const updateEnquiry = (id, payload) =>
  api.put(`/api/enquiries/${id}`, payload, { headers: authHeader() });

export const deleteEnquiry = (id) =>
  api.delete(`/api/enquiries/${id}`, { headers: authHeader() });
