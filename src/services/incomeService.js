import api from "../apis/axios";

// Fetch list
export const fetchIncomes = (params = {}) =>
  api.get("/api/incomes", { params });

// Create
export const createIncome = (payload) =>
  api.post("/api/incomes", payload);

// Update
export const updateIncome = (id, payload) =>
  api.put(`/api/incomes/${id}`, payload);

// Delete
export const deleteIncome = (id) =>
  api.delete(`/api/incomes/${id}`);
