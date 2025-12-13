// src/lib/api.js
export const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";
const TOKEN_KEY = "token";

export const getToken = () => localStorage.getItem(TOKEN_KEY) || "";
export const setToken = (t='') => { if (t) localStorage.setItem(TOKEN_KEY, t); };
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const authHeaders = () => {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
};

export async function postJSON(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(()=>null);
  if (!res.ok) throw new Error(json?.message || `HTTP ${res.status}`);
  return json;
}

export async function getJSON(path) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...authHeaders() }
  });
  const json = await res.json().catch(()=>null);
  if (!res.ok) throw new Error(json?.message || `HTTP ${res.status}`);
  return json;
}
