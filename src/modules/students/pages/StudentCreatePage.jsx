// src/modules/students/pages/StudentCreatePage.jsx

import React, { useState, useEffect } from "react";
import { createStudent } from "../api/studentApi";
import { fetchClasses } from "../../classes/api/classApi";
import StudentForm from "../components/StudentForm";
import { useNavigate } from "react-router-dom";

const StudentCreatePage = () => {
  const [submitting, setSubmitting] = useState(false);
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();

  // Load classes on mount
  useEffect(() => {
    const loadClasses = async () => {
      try {
        const res = await fetchClasses();
        setClasses(res.data.data); // your API returns { data: [...] }
      } catch (err) {
        console.error("Failed to load classes:", err);
      }
    };
    loadClasses();
  }, []);

  // Handle form submit
  const handleSubmit = async (form) => {
    try {
      setSubmitting(true);

      const user = JSON.parse(localStorage.getItem("user"));
      const schoolId = user?.schoolId;
      const branchId = user?.branchId;

      const data = new FormData();

      // Required fields
      data.append("schoolId", schoolId);
      if (branchId) {
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

      await createStudent(data);

      navigate("/admin/students");
    } catch (err) {
      console.error("Failed to create student:", err);
      alert(err.response?.data?.message || "Failed to create student");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-semibold text-[#0a1a44] mb-6">
        New Student Admission
      </h2>

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
