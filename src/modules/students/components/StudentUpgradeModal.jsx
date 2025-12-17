import React, { useEffect, useState } from "react";
import { upgradeStudent } from "../api/studentApi";

const StudentUpgradeModal = ({ student, onClose, onUpgraded }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    newClassId: "",
    newSection: "",
    newStream: "",
    newRollNo: "",
    newAdmissionSession: "",
  });

  useEffect(() => {
    setClasses([
      { _id: "1", name: "Class 1" },
      { _id: "2", name: "Class 2" },
      { _id: "3", name: "Class 3" },
      { _id: "4", name: "Class 4" },
      { _id: "5", name: "Class 5" },
      { _id: "6", name: "Class 6" },
      { _id: "7", name: "Class 7" },
      { _id: "8", name: "Class 8" },
      { _id: "9", name: "Class 9" },
      { _id: "10", name: "Class 10" },
      { _id: "11", name: "Class 11" },
      { _id: "12", name: "Class 12" },
    ]);
  }, []);

  useEffect(() => {
    const currentSession = student?.admissionSession;
    if (currentSession) {
      const [start, end] = currentSession.split("-");
      const nextSession = `${Number(start) + 1}-${Number(end) + 1}`;
      setForm((prev) => ({ ...prev, newAdmissionSession: nextSession }));
    }
  }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.newClassId || !form.newRollNo || !form.newAdmissionSession) {
      alert("Please fill required fields");
      return;
    }

    try {
      setLoading(true);
      await upgradeStudent(student._id, form);
      onUpgraded();
      onClose();
    } catch (err) {
      console.error("Upgrade failed:", err);
      alert("Failed to upgrade student");
    } finally {
      setLoading(false);
    }
  };

  if (!student) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 animate-fadeIn">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Upgrade Student
        </h2>

        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-700 font-medium">
            {student.firstName} {student.lastName}
          </p>
          <p className="text-sm text-gray-600">
            Current Class: {student.classId?.name || "-"}
          </p>
          <p className="text-sm text-gray-600">Roll No: {student.rollNo}</p>
        </div>

        <div className="space-y-4">
          {/* New Class */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Class *
            </label>
            <select
              name="newClassId"
              value={form.newClassId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Class</option>
              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Section
            </label>
            <input
              name="newSection"
              value={form.newSection}
              onChange={handleChange}
              placeholder="Section"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Stream */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Stream
            </label>
            <input
              name="newStream"
              value={form.newStream}
              onChange={handleChange}
              placeholder="Stream"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Roll No */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Roll No *
            </label>
            <input
              name="newRollNo"
              value={form.newRollNo}
              onChange={handleChange}
              placeholder="Roll No"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Admission Session */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Admission Session *
            </label>
            <input
              name="newAdmissionSession"
              value={form.newAdmissionSession}
              onChange={handleChange}
              placeholder="2025-26"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? "Upgrading..." : "Upgrade"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentUpgradeModal;
