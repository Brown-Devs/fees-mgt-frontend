import api from "../apis/axios";

// Fetch expenses
export const fetchExpenses = (params = {}) =>
  api.get("/api/expenses", { params });

// Create expense
export const createExpense = (payload) =>
  api.post("/api/expenses", payload);

// Update expense
export const updateExpense = (id, payload) =>
  api.put(`/api/expenses/${id}`, payload);

// Delete expense
export const deleteExpense = (id) =>
  api.delete(`/api/expenses/${id}`);
