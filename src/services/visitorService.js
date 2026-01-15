import axios from "axios";
const api = axios.create();
const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

export const fetchVisitors = (params = {}) =>
  api.get("/api/visitors", { params, headers: authHeader() });

export const createVisitor = (payload) =>
  api.post("/api/visitors", payload, { headers: authHeader() });

export const updateVisitor = (id, payload) =>
  api.put(`/api/visitors/${id}`, payload, { headers: authHeader() });

export const deleteVisitor = (id) =>
  api.delete(`/api/visitors/${id}`, { headers: authHeader() });
