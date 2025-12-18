// src/modules/students/pages/StudentEditPage.jsx

import React, { useEffect, useState } from "react";
import { fetchStudent, updateStudent } from "../api/studentApi";
import { fetchClasses } from "../../classes/api/classApi";
import StudentForm from "../components/StudentForm";
import { useParams, useNavigate } from "react-router-dom";

const StudentEditPage = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState(null);
  const [classes, setClasses] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Prevent invalid fetch when URL is /admin/students/new
  useEffect(() => {
    if (!studentId || studentId === "new" || studentId === "create") return;

    const loadStudent = async () => {
  try {
    const res = await fetchStudent(studentId);
    const student = res.data.data;

    setInitialValues({
      ...student,
      classId: student.classId?._id || "",
      section: student.section || "",
      stream: student.stream || "",
      fatherName: student.fatherName || "",
      motherName: student.motherName || "",
      guardianName: student.guardianName || "",
      // add all fields that may be null
    });
  } catch (err) {
    console.error("Failed to load student:", err);
  }
};


    loadStudent();
  }, [studentId]);

  // Load classes
  useEffect(() => {
    const loadClasses = async () => {
      try {
        const res = await fetchClasses();
        setClasses(res.data.data);
      } catch (err) {
        console.error("Failed to load classes:", err);
      }
    };
    loadClasses();
  }, []);

  // Handle update
  const handleSubmit = async (form) => {
    try {
      setSubmitting(true);

      const user = JSON.parse(localStorage.getItem("user"));
      const schoolId = user?.schoolId;
      const branchId = user?.branchId;

      const data = new FormData();

      // Required fields
      data.append("schoolId", schoolId);
      if (branchId) {setInitialValues(res.data);

  data.append("branchId", branchId);
}


      data.append("admissionNo", String(form.admissionNo));
      data.append("admissionDate", String(form.admissionDate));
      data.append("admissionSession", String(form.admissionSession));
      data.append("isNewAdmission", String(form.isNewAdmission));

      data.append("firstName", String(form.firstName));
      data.append("lastName", String(form.lastName));
      data.append("gender", String(form.gender));
      data.append("dob", String(form.dob));
      data.append("religion", String(form.religion));

      data.append("mobile", String(form.mobile));
      data.append("email", String(form.email));
      data.append("emergencyContact", String(form.emergencyContact));

      data.append("classId", String(form.classId));
      data.append("section", String(form.section));
      data.append("stream", String(form.stream));
      data.append("rollNo", String(form.rollNo));

      data.append("address", String(form.address));

      data.append("fatherName", String(form.fatherName));
      data.append("fatherMobile", String(form.fatherMobile));
      data.append("fatherOccupation", String(form.fatherOccupation));

      data.append("motherName", String(form.motherName));
      data.append("motherMobile", String(form.motherMobile));
      data.append("motherOccupation", String(form.motherOccupation));

      data.append("guardianName", String(form.guardianName));
      data.append("guardianMobile", String(form.guardianMobile));
      data.append("guardianRelation", String(form.guardianRelation));

      data.append("usesTransport", String(form.usesTransport));
      data.append("transportRoute", String(form.transportRoute));
      data.append("transportFee", String(form.transportFee));

      data.append("status", String(form.status));

      // Files
      if (form.photoFile) {
        data.append("photo", form.photoFile);
      }

      if (form.idProofFile) {
        data.append("idProof", form.idProofFile);
      }

      await updateStudent(studentId, data);

      navigate("/admin/students");
    } catch (err) {
      console.error("Failed to update student:", err);
      alert(err.response?.data?.message || "Failed to update student");
    } finally {
      setSubmitting(false);
    }
  };

  if (!initialValues) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading student details...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-semibold text-[#0a1a44] mb-6">
        Edit Student
      </h2>

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
