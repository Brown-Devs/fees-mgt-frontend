// src/pages/parent/hooks/useStudentByParent.js
import { useState, useEffect } from "react";
import api from "../../../apis/axios";

export function useStudentByParent() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    api.get("/api/students/by-parent")
      .then(res => setStudent(res.data.data))
      .catch(err => setError(err?.response?.data?.message || "Failed to load student"))
      .finally(() => setLoading(false));
  }, []);

  return { student, loading, error };
}