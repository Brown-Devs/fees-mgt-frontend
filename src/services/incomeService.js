import axios from "axios";
const api = axios.create();
const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

export const fetchIncomes = (params = {}) =>
  api.get("/api/incomes", { params, headers: authHeader() });

export const createIncome = (payload) =>
  api.post("/api/incomes", payload, { headers: authHeader() });

export const updateIncome = (id, payload) =>
  api.put(`/api/incomes/${id}`, payload, { headers: authHeader() });

export const deleteIncome = (id) =>
  api.delete(`/api/incomes/${id}`, { headers: authHeader() });
