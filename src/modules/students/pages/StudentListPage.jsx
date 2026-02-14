// src/modules/students/pages/StudentListPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchStudents } from "../api/studentApi";
import api from "../../../apis/axios";

const StudentListPage = () => {
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/80 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#001f3f]">
              Students
            </h1>
            <p className="text-gray-500 mt-1">
              Manage student records and academic transitions.
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/students/new")}
            className="px-5 py-2.5 bg-[#001f3f] hover:bg-[#001933]
                       text-white rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            + Add Student
          </button>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center gap-2 pb-4 border-b mb-6">
            <div className="w-1 h-6 bg-[#001f3f] rounded-full" />
            <h2 className="text-lg font-semibold text-[#001f3f]">
              Student List
            </h2>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Class</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Roll No</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Mobile</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-gray-400">
                      No students found
                    </td>
                  </tr>
                ) : (
                  students.map((s) => (
                    <tr key={s._id} className="hover:bg-[#001f3f]/[0.02]">
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {s.firstName} {s.lastName}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {s.classId?.name || "-"}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {s.rollNo || "-"}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {s.mobile || "-"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            s.status === "Active"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center space-x-3">
                        <button
                          onClick={() => navigate(`/admin/students/${s._id}`)}
                          className="text-[#001f3f] font-medium hover:underline"
                        >
                          View
                        </button>

                        <button
                          onClick={() =>
                            navigate(`/admin/students/${s._id}/edit`)
                          }
                          className="text-emerald-600 font-medium hover:underline"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => openUpgradeModal(s)}
                          className="text-indigo-600 font-medium hover:underline"
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

      </div>
    </div>

    {/* ================= UPGRADE MODAL ================= */}
    {upgradeModal && selectedStudent && (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-xl w-[420px] p-6 space-y-4">
          <h3 className="text-xl font-semibold text-[#001f3f]">
            Upgrade Student
          </h3>

          <p className="text-gray-600 text-sm">
            <strong>
              {selectedStudent.firstName} {selectedStudent.lastName}
            </strong>
            <br />
            Current Class: {selectedStudent.classId?.name}
          </p>

          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-xl
                       focus:ring-2 focus:ring-[#001f3f]/20 focus:border-[#001f3f]"
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

          <div className="w-full px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm">
            Section: {upgradeForm.newSection || "-"}
          </div>

          <div className="w-full px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm">
            Stream: {upgradeForm.newStream || "-"}
          </div>

          <input
            type="number"
            placeholder="New Roll Number"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl"
            value={upgradeForm.newRollNo}
            onChange={(e) =>
              setUpgradeForm({ ...upgradeForm, newRollNo: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="New Admission Session (e.g., 2024-25)"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl"
            value={upgradeForm.newAdmissionSession}
            onChange={(e) =>
              setUpgradeForm({
                ...upgradeForm,
                newAdmissionSession: e.target.value,
              })
            }
          />

          <div className="flex justify-end gap-3 pt-3">
            <button
              className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300"
              onClick={closeUpgradeModal}
            >
              Cancel
            </button>

            <button
              className="px-4 py-2 bg-[#001f3f] text-white rounded-xl hover:bg-[#001933]"
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
