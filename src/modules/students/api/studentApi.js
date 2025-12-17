import axios from "../../../apis/axios";

const BASE_URL = "/api/students";

export const fetchStudents = async (params) => {
  const res = await axios.get(BASE_URL, { params });
  return res.data;
};

export const fetchStudentById = async (studentId) => {
  const res = await axios.get(`${BASE_URL}/${studentId}`);
  return res.data;
};

export const createStudent = async (formData) => {
  const res = await axios.post(BASE_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateStudent = async (studentId, formData) => {
  const res = await axios.put(`${BASE_URL}/${studentId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deactivateStudent = async (studentId) => {
  const res = await axios.delete(`${BASE_URL}/${studentId}`);
  return res.data;
};

export const upgradeStudent = async (studentId, payload) => {
  const res = await axios.put(`${BASE_URL}/${studentId}/upgrade`, payload);
  return res.data;
};

export const fetchStudentFeesInfo = async (studentId) => {
  const res = await axios.get(`${BASE_URL}/${studentId}/fees`);
  return res.data;
};

export const fetchStudentAttendance = async (studentId) => {
  const res = await axios.get(`${BASE_URL}/${studentId}/attendance`);
  return res.data;
};
