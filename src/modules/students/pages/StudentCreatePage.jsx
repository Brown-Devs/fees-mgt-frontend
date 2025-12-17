// src/modules/students/pages/StudentCreatePage.jsx
import React, { useState, useEffect } from "react";
import { createStudent } from "../api/studentApi";
import StudentForm from "../components/StudentForm";
import { useNavigate } from "react-router-dom";
// import { fetchClasses } from "../../classes/api/classApi"; // if you have this

const StudentCreatePage = () => {
  const [submitting, setSubmitting] = useState(false);
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: load classes from API
    // fetchClasses().then((res) => setClasses(res.data));
  }, []);

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      await createStudent(formData);
      navigate("/students");
    } catch (err) {
      console.error("Failed to create student:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="student-create-page">
      <h2>New Admission</h2>
      <StudentForm
        initialValues={null}
        onSubmit={handleSubmit}
        submitting={submitting}
        classes={classes}
      />
    </div>
  );
};

export default StudentCreatePage;
