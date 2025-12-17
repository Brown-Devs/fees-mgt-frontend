// src/modules/students/components/StudentForm.jsx
import React, { useState, useEffect } from "react";

const StudentForm = ({ initialValues, onSubmit, submitting, classes }) => {
  const [form, setForm] = useState(
    initialValues || {
      admissionNo: "",
      admissionDate: "",
      admissionSession: "",
      isNewAdmission: true,

      firstName: "",
      lastName: "",
      gender: "",
      dob: "",
      religion: "",
      mobile: "",
      email: "",
      emergencyContact: "",

      classId: "",
      section: "",
      stream: "",
      rollNo: "",
      address: "",

      fatherName: "",
      fatherMobile: "",
      fatherOccupation: "",
      motherName: "",
      motherMobile: "",
      motherOccupation: "",
      guardianName: "",
      guardianMobile: "",
      guardianRelation: "",

      usesTransport: false,
      transportRoute: "",
      transportFee: "",

      status: "Active",
    }
  );

  const [photoFile, setPhotoFile] = useState(null);
  const [idProofFile, setIdProofFile] = useState(null);

  useEffect(() => {
    if (initialValues) {
      setForm((prev) => ({
        ...prev,
        ...initialValues,
        dob: initialValues.dob
          ? initialValues.dob.slice(0, 10)
          : "",
        admissionDate: initialValues.admissionDate
          ? initialValues.admissionDate.slice(0, 10)
          : "",
      }));
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        data.append(key, value);
      }
    });

    if (photoFile) data.append("photo", photoFile);
    if (idProofFile) data.append("idProof", idProofFile);

    onSubmit(data);
  };

  return (
    <form className="student-form" onSubmit={handleSubmit}>
      <h3>Admission Details</h3>
      <div className="form-row">
        <input
          name="admissionNo"
          value={form.admissionNo}
          onChange={handleChange}
          placeholder="Admission No."
          required
        />
        <input
          type="date"
          name="admissionDate"
          value={form.admissionDate}
          onChange={handleChange}
          required
        />
        <input
          name="admissionSession"
          value={form.admissionSession}
          onChange={handleChange}
          placeholder="Admission Session (e.g. 2024-25)"
          required
        />
        <label>
          <input
            type="checkbox"
            name="isNewAdmission"
            checked={form.isNewAdmission}
            onChange={handleChange}
          />
          New Admission
        </label>
      </div>

      <h3>Student Info</h3>
      <div className="form-row">
        <input
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          placeholder="First Name"
          required
        />
        <input
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          placeholder="Last Name"
        />
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          required
        >
          <option value="">Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="date"
          name="dob"
          value={form.dob}
          onChange={handleChange}
          required
        />
        <input
          name="religion"
          value={form.religion}
          onChange={handleChange}
          placeholder="Religion"
        />
      </div>

      <div className="form-row">
        <input
          name="mobile"
          value={form.mobile}
          onChange={handleChange}
          placeholder="Mobile"
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          name="emergencyContact"
          value={form.emergencyContact}
          onChange={handleChange}
          placeholder="Emergency Contact No."
        />
      </div>

      <h3>Class Info</h3>
      <div className="form-row">
        <select
          name="classId"
          value={form.classId}
          onChange={handleChange}
          required
        >
          <option value="">Select Class</option>
          {classes.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          name="section"
          value={form.section}
          onChange={handleChange}
          placeholder="Section"
        />
        <input
          name="stream"
          value={form.stream}
          onChange={handleChange}
          placeholder="Stream"
        />
        <input
          name="rollNo"
          value={form.rollNo}
          onChange={handleChange}
          placeholder="Roll No."
          required
        />
      </div>

      <h3>Address</h3>
      <textarea
        name="address"
        value={form.address}
        onChange={handleChange}
        placeholder="Address"
      />

      <h3>Parent Details</h3>
      <div className="form-row">
        <input
          name="fatherName"
          value={form.fatherName}
          onChange={handleChange}
          placeholder="Father's Name"
        />
        <input
          name="fatherMobile"
          value={form.fatherMobile}
          onChange={handleChange}
          placeholder="Father's Mobile"
        />
        <input
          name="fatherOccupation"
          value={form.fatherOccupation}
          onChange={handleChange}
          placeholder="Father's Occupation"
        />
      </div>
      <div className="form-row">
        <input
          name="motherName"
          value={form.motherName}
          onChange={handleChange}
          placeholder="Mother's Name"
        />
        <input
          name="motherMobile"
          value={form.motherMobile}
          onChange={handleChange}
          placeholder="Mother's Mobile"
        />
        <input
          name="motherOccupation"
          value={form.motherOccupation}
          onChange={handleChange}
          placeholder="Mother's Occupation"
        />
      </div>

      <h4>Guardian (if no parents)</h4>
      <div className="form-row">
        <input
          name="guardianName"
          value={form.guardianName}
          onChange={handleChange}
          placeholder="Guardian Name"
        />
        <input
          name="guardianMobile"
          value={form.guardianMobile}
          onChange={handleChange}
          placeholder="Guardian Mobile"
        />
        <input
          name="guardianRelation"
          value={form.guardianRelation}
          onChange={handleChange}
          placeholder="Guardian Relation"
        />
      </div>

      <h3>Transport / Utility Fees</h3>
      <div className="form-row">
        <label>
          <input
            type="checkbox"
            name="usesTransport"
            checked={form.usesTransport}
            onChange={handleChange}
          />
          Uses Transport (Bus/Van)
        </label>
        <input
          name="transportRoute"
          value={form.transportRoute}
          onChange={handleChange}
          placeholder="Route"
        />
        <input
          name="transportFee"
          value={form.transportFee}
          onChange={handleChange}
          placeholder="Transport Fee"
          type="number"
        />
      </div>

      <h3>Documents</h3>
      <div className="form-row">
        <label>
          Photo:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhotoFile(e.target.files[0])}
          />
        </label>
        <label>
          ID Proof:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setIdProofFile(e.target.files[0])}
          />
        </label>
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? "Saving..." : "Save Student"}
      </button>
    </form>
  );
};

export default StudentForm;
