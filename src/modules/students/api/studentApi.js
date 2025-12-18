import api from "../../../apis/axios";

export const fetchStudents = (params) =>
  api.get("/api/students", { params });

export const fetchStudent = (id) =>
  api.get(`/api/students/${id}`);

export const createStudent = (formData) =>
  api.post("/api/students", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateStudent = (id, formData) =>
  api.put(`/api/students/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deactivateStudent = (id) =>
  api.delete(`/api/students/${id}`);

export const upgradeStudent = (id, payload) =>
  api.put(`/api/students/${id}/upgrade`, payload);

export const fetchStudentFees = (id) =>
  api.get(`/api/students/${id}/fees`);

export const fetchStudentAttendance = (id) =>
  api.get(`/api/students/${id}/attendance`);

export const addStudentAttendance = (id, payload) =>
  api.post(`/api/students/${id}/attendance`, payload);
