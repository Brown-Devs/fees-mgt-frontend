// src/modules/students/pages/StudentListPage.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchStudents } from "../api/studentApi";
import api from "../../../apis/axios";

const StudentListPage = () => {
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [upgradeModal, setUpgradeModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [upgradeForm, setUpgradeForm] = useState({
    newClassId: "",
    newSection: "",
    newStream: "",
    newRollNo: "",
    newAdmissionSession: "",
  });

  /* ================= LOAD DATA ================= */
  const loadStudents = async () => {
    try {
      const res = await fetchStudents();
      setStudents(res.data?.data || res.data || []);
    } catch (err) {
      console.error("Failed to load students", err);
    }
  };

  const loadClasses = async () => {
  try {
    const schoolId = localStorage.getItem("schoolId");

    const res = await api.get("/api/classes", {
      params: { schoolId }
    });

    setClasses(res.data?.data || res.data || []);
  } catch (err) {
    console.error("Failed to load classes", err);
  }
};


  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([loadStudents(), loadClasses()]);
      setLoading(false);
    };
    init();
  }, []);

  /* ================= AUTO ROLL NUMBER ================= */
  useEffect(() => {
    if (!upgradeForm.newClassId) return;

    const studentsInClass = students.filter(
      (s) => s.classId?._id === upgradeForm.newClassId
    );

    const maxRoll = Math.max(
      0,
      ...studentsInClass.map((s) => Number(s.rollNo || 0))
    );

    setUpgradeForm((prev) => ({
      ...prev,
      newRollNo: maxRoll + 1,
    }));
  }, [upgradeForm.newClassId, students]);

  /* ================= MODAL HANDLERS ================= */
  const openUpgradeModal = (student) => {
    setSelectedStudent(student);
    setUpgradeForm({
      newClassId: "",
      newSection: "",
      newStream: "",
      newRollNo: "",
      newAdmissionSession: "",
    });
    setUpgradeModal(true);
  };

  const closeUpgradeModal = () => {
    setUpgradeModal(false);
    setSelectedStudent(null);
  };

  /* ================= UPGRADE STUDENT ================= */
  const upgradeStudent = async () => {
    if (!selectedStudent) return;

    try {
      await api.put(
        `/api/students/${selectedStudent._id}/upgrade`,
        upgradeForm
      );

      alert("Student upgraded successfully");
      closeUpgradeModal();
      loadStudents();
    } catch (err) {
      alert(err.response?.data?.message || "Upgrade failed");
    }
  };

  /* ================= RENDER ================= */
  return (
    <>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-[#0a1a44]">
            Students
          </h2>

          <button
            onClick={() => navigate("/admin/students/new")}
            className="px-4 py-2 bg-[#0a1a44] text-white rounded-lg hover:bg-[#0c2258]"
          >
            + Add Student
          </button>
        </div>

        {/* Table */}
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#0a1a44] text-white">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Class</th>
                <th className="p-3">Roll No</th>
                <th className="p-3">Mobile</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-500">
                    No students found
                  </td>
                </tr>
              ) : (
                students.map((s) => (
                  <tr key={s._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      {s.firstName} {s.lastName}
                    </td>
                    <td className="p-3">{s.classId?.name || "-"}</td>
                    <td className="p-3">{s.rollNo || "-"}</td>
                    <td className="p-3">{s.mobile || "-"}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          s.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>

                    <td className="p-3 flex gap-3">
                      <button
                        onClick={() => navigate(`/admin/students/${s._id}`)}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </button>

                      <button
                        onClick={() =>
                          navigate(`/admin/students/${s._id}/edit`)
                        }
                        className="text-emerald-600 hover:underline"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => openUpgradeModal(s)}
                        className="text-indigo-600 hover:underline"
                      >
                        Upgrade
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= UPGRADE MODAL ================= */}
      {upgradeModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-4">
            <h3 className="text-xl font-semibold">Upgrade Student</h3>

            <p className="text-gray-600">
              <strong>
                {selectedStudent.firstName} {selectedStudent.lastName}
              </strong>
              <br />
              Current Class: {selectedStudent.classId?.name}
            </p>

            {/* New Class */}
            <select
  className="w-full border p-2 rounded"
  value={upgradeForm.newClassId}
  onChange={(e) => {
    const classId = e.target.value;
    const selected = classes.find((c) => c._id === classId);

    setUpgradeForm({
      ...upgradeForm,
      newClassId: classId,
      newSection: selected?.section || "",
      newStream: selected?.stream || "",
    });
  }}
>
  <option value="">Select New Class</option>

  {classes.map((c) => (
    <option key={c._id} value={c._id}>
      {c.name}
      {c.section ? ` - ${c.section}` : ""}
      {c.stream ? ` - ${c.stream}` : ""}
    </option>
  ))}
</select>

            <div className="w-full border p-2 rounded bg-gray-100 text-gray-700">
  Section: {upgradeForm.newSection || "-"}
</div>

<div className="w-full border p-2 rounded bg-gray-100 text-gray-700">
  Stream: {upgradeForm.newStream || "-"}
</div>

            <input
              type="number"
              placeholder="New Roll Number"
              className="w-full border p-2 rounded"
              value={upgradeForm.newRollNo}
              onChange={(e) =>
                setUpgradeForm({ ...upgradeForm, newRollNo: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="New Admission Session (e.g., 2024-25)"
              className="w-full border p-2 rounded"
              value={upgradeForm.newAdmissionSession}
              onChange={(e) =>
                setUpgradeForm({
                  ...upgradeForm,
                  newAdmissionSession: e.target.value,
                })
              }
            />

            <div className="flex justify-end gap-3">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={closeUpgradeModal}
              >
                Cancel
              </button>

              <button
                className="bg-[#0a1a44] text-white px-4 py-2 rounded"
                onClick={upgradeStudent}
              >
                Upgrade
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentListPage;
