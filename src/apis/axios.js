import axios from "axios";

const api = axios.create({
  baseURL: "https://fees-mgmt-backend-1.onrender.com",   // Backend URL
});

export default api;
