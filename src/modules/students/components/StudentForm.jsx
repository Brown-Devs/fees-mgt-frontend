import React, { useState, useEffect } from "react";
import api from "../../../apis/axios";


export default function StudentForm({
  initialValues,
  onSubmit,
  submitting,
  classes,
  isEdit = false,
}) {
  const [routes, setRoutes] = useState([]);
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
  const [photoPreview, setPhotoPreview] = useState(null);
  const [idProofPreview, setIdProofPreview] = useState(null);

  useEffect(() => {
  const loadRoutes = async () => {
    try {
      const schoolId = localStorage.getItem("schoolId");
      const res = await api.get("/api/transport/routes", {
        params: { schoolId }
      });
      setRoutes(res.data.data);
    } catch (err) {
      console.error("Failed to load routes:", err);
    }
  };

  loadRoutes();
}, []);

  useEffect(() => {
    if (initialValues) {
      setForm(prev => ({
  ...prev,
  ...initialValues,
  dob: initialValues.dob?.slice(0, 10) || "",
  admissionDate: initialValues.admissionDate?.slice(0, 10) || "",
  transportRoute: initialValues.transportRoute || "",
  transportFee: initialValues.transportFee ?? "",
}));


      setPhotoPreview(initialValues.photoUrl || null);
      setIdProofPreview(initialValues.idProofUrl || null);
    }
  }, [initialValues]);
  useEffect(() => {
  if (!form.classId) return;

  const selectedClass = classes.find(c => c._id === form.classId);
  if (!selectedClass) return;

  setForm(prev => ({
    ...prev,
    stream: selectedClass.stream || ""
  }));
}, [form.classId, classes]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "usesTransport") {
  const checked = e.target.checked;

  setForm(prev => ({
    ...prev,
    usesTransport: checked,
    transportRoute: checked ? prev.transportRoute : "",
    transportFee: checked ? prev.transportFee : "",
  }));

  return;
}
const handleRouteChange = (e) => {
  const selectedName = e.target.value;
  const selected = routes.find(r => r.name === selectedName);

  setForm(prev => ({
    ...prev,
    transportRoute: selectedName,
    transportFee: selected ? selected.fee : "",
  }));
};

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleIdProofChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIdProofFile(file);
    setIdProofPreview(URL.createObjectURL(file));
  };
  const handleRouteChange = (e) => {
  const selectedName = e.target.value;
  const selected = routes.find(r => r.name === selectedName);

  setForm(prev => ({
    ...prev,
    transportRoute: selectedName,
    transportFee: selected ? selected.fee : "",
  }));
};


  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, photoFile, idProofFile });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* ADMISSION DETAILS */}
      <div className="card">
        <h3 className="section-title">Admission Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Admission No</label>
            <input
  name="admissionNo"
  value={form.admissionNo}
  onChange={handleChange}
  disabled={isEdit}   
  className={`input ${isEdit ? "bg-gray-100 cursor-not-allowed" : ""}`}
  required
/>

          </div>

          <div>
            <label className="label">Admission Date</label>
            <input
              type="date"
              name="admissionDate"
              value={form.admissionDate}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <label className="label">Session</label>
            <input
              name="admissionSession"
              value={form.admissionSession}
              onChange={handleChange}
              placeholder="2024-25"
              className="input"
              required
            />
          </div>
        </div>
      </div>

      {/* STUDENT INFO */}
      <div className="card">
        <h3 className="section-title">Student Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">First Name</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <label className="label">Last Name</label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label className="label">Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="label">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <label className="label">Religion</label>
            <input
              name="religion"
              value={form.religion}
              onChange={handleChange}
              className="input"
            />
          </div>
        </div>
      </div>

      {/* CONTACT INFO */}
      <div className="card">
        <h3 className="section-title">Contact Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Mobile</label>
            <input
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label className="label">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label className="label">Emergency Contact</label>
            <input
              name="emergencyContact"
              value={form.emergencyContact}
              onChange={handleChange}
              className="input"
            />
          </div>
        </div>
      </div>

      {/* CLASS INFO */}
      <div className="card">
        <h3 className="section-title">Class Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Class</label>
            <select
  name="classId"
  value={form.classId}
  onChange={handleChange}
  className="mt-1 block w-full border rounded-lg p-2"
>
  <option value="">Select Class</option>

  {classes.map(c => (
    <option key={c._id} value={c._id}>
      {c.name} {c.section} 
      {c.stream ? ` — ${c.stream}` : ""}
    </option>
  ))}
</select>

          </div>

          <div>
            <label className="label">Section</label>
            <input
              name="section"
              value={form.section}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label className="label">Roll No</label>
            <input
  name="rollNo"
  value={form.rollNo}
  onChange={handleChange}
  disabled={isEdit}   
  className={`input ${isEdit ? "bg-gray-100 cursor-not-allowed" : ""}`}
  required
/>

          </div>
        </div>
      </div>

      {/* ADDRESS */}
      <div className="card">
        <h3 className="section-title">Address</h3>
        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          className="input h-24"
        />
      </div>

      {/* PARENTS */}
      <div className="card">
        <h3 className="section-title">Parent Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Father Name</label>
            <input
              name="fatherName"
              value={form.fatherName}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label className="label">Father Mobile</label>
            <input
              name="fatherMobile"
              value={form.fatherMobile}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label className="label">Father Occupation</label>
            <input
              name="fatherOccupation"
              value={form.fatherOccupation}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label className="label">Mother Name</label>
            <input
              name="motherName"
              value={form.motherName}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label className="label">Mother Mobile</label>
            <input
              name="motherMobile"
              value={form.motherMobile}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label className="label">Mother Occupation</label>
            <input
              name="motherOccupation"
              value={form.motherOccupation}
              onChange={handleChange}
              className="input"
            />
          </div>
        </div>
      </div>

      {/* GUARDIAN */}
      <div className="card">
        <h3 className="section-title">Guardian Details (Optional)</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Guardian Name</label>
            <input
              name="guardianName"
              value={form.guardianName}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label className="label">Guardian Mobile</label>
            <input
              name="guardianMobile"
              value={form.guardianMobile}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label className="label">Relation</label>
            <input
              name="guardianRelation"
              value={form.guardianRelation}
              onChange={handleChange}
              className="input"
            />
          </div>
        </div>
      </div>

      {/* TRANSPORT */}
      <div className="card">
        <h3 className="section-title">Transport Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="usesTransport"
              checked={form.usesTransport}
              onChange={handleChange}
            />
            Uses Transport
          </label>

          <div>
            <label className="label">Route</label>
            <select
  name="transportRoute"
  value={form.transportRoute}
  onChange={handleRouteChange}
  disabled={!form.usesTransport}
  className={`border p-2 rounded w-full ${
    !form.usesTransport ? "bg-gray-100 cursor-not-allowed" : ""
  }`}
>
  <option value="">Select Route</option>
  {routes.map((r) => (
    <option key={r._id} value={r.name}>
      {r.name} — ₹{r.fee}
    </option>
  ))}
</select>

          </div>

          <div>
            <label className="label">Transport Fee</label>
           <input
  type="number"
  name="transportFee"
  value={form.transportFee || ""}
  onChange={handleChange}
  disabled={!form.usesTransport}
  className={`border p-2 rounded w-full ${
    !form.usesTransport ? "bg-gray-100 cursor-not-allowed" : ""
  }`}
/>

          </div>
        </div>
      </div>

      {/* DOCUMENTS */}
      <div className="card">
        <h3 className="section-title">Documents</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">Student Photo</label>
            <input type="file" accept="image/*" onChange={handlePhotoChange} />
            {photoPreview && (
              <img
                src={photoPreview}
                className="w-24 h-24 rounded-lg object-cover mt-2 border"
              />
            )}
          </div>

          <div>
            <label className="label">ID Proof</label>
            <input type="file" accept="image/*" onChange={handleIdProofChange} />
            {idProofPreview && (
              <img
                src={idProofPreview}
                className="w-24 h-24 rounded-lg object-cover mt-2 border"
              />
            )}
          </div>
        </div>
      </div>

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-[#0a1a44] text-white py-3 rounded-lg hover:bg-[#0c2258]"
      >
        {submitting ? "Saving..." : "Save Student"}
      </button>
    </form>
  );
}
