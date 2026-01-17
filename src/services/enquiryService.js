import api from "../apis/axios";

// Fetch enquiries
export const fetchEnquiries = (params = {}) =>
  api.get("/api/enquiries", { params });

// Create enquiry
export const createEnquiry = (payload) =>
  api.post("/api/enquiries", payload);

// Update enquiry
export const updateEnquiry = (id, payload) =>
  api.put(`/api/enquiries/${id}`, payload);

// Delete enquiry
export const deleteEnquiry = (id) =>
  api.delete(`/api/enquiries/${id}`);
