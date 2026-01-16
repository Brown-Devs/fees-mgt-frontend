import axios from "axios";
const api = axios.create();
const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

export const fetchExpenses = (params = {}) =>
  api.get("/api/expenses", { params, headers: authHeader() });

export const createExpense = (payload) =>
  api.post("/api/expenses", payload, { headers: authHeader() });

export const updateExpense = (id, payload) =>
  api.put(`/api/expenses/${id}`, payload, { headers: authHeader() });

export const deleteExpense = (id) =>
  api.delete(`/api/expenses/${id}`, { headers: authHeader() });
