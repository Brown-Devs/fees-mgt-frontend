import api from "../apis/axios";

// Fetch visitors
export const fetchVisitors = (params = {}) =>
  api.get("/api/visitors", { params });

// Create visitor
export const createVisitor = (payload) =>
  api.post("/api/visitors", payload);

// Update visitor
export const updateVisitor = (id, payload) =>
  api.put(`/api/visitors/${id}`, payload);

// Delete visitor
export const deleteVisitor = (id) =>
  api.delete(`/api/visitors/${id}`);
