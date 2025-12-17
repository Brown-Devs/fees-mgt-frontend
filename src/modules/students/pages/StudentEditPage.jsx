// src/modules/students/pages/StudentEditPage.jsx
import React, { useEffect, useState } from "react";
import { fetchStudentById, updateStudent } from "../api/studentApi";
import StudentForm from "../components/StudentForm";
import { useParams, useNavigate } from "react-router-dom";

const StudentEditPage = () => {
  const { studentId } = useParams();
  const [initialValues, setInitialValues] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchStudentById(studentId);
        setInitialValues(res.data);
        // TODO: load classes
      } catch (err) {
        console.error("Failed to load student:", err);
      }
    };
    load();
  }, [studentId]);

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      await updateStudent(studentId, formData);
      navigate("/students");
    } catch (err) {
      console.error("Failed to update student:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!initialValues) return <div>Loading...</div>;

  return (
    <div className="student-edit-page">
      <h2>Edit Student</h2>
      <StudentForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitting={submitting}
        classes={classes}
      />
    </div>
  );
};

export default StudentEditPage;
