import React, { useEffect, useState } from "react";
import api from "../../../apis/axios";
import StaffForm from "./CreateStaff";

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTeacher, setEditTeacher] = useState(null);

  const loadTeachers = async () => {
    try {
      const res = await api.get("/api/staff/teachers");
      setTeachers(res.data.data);
    } catch (err) {
      console.error("Failed to load teachers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTeachers(); }, []);

  if (loading) return <p className="p-6 text-gray-500">Loading teachers...</p>;

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-[#0a1a44]">Teachers</h2>
      
      <button
        onClick={() => { setEditTeacher(null); setShowForm(true); }}
        className="mb-4 px-5 py-2 bg-[#0a1a44] text-white rounded hover:bg-[#132b6b] transition"
      >
        + Create Teacher
      </button>

      {showForm && (
        <StaffForm
          role="teacher"
          staff={editTeacher}
          onSuccess={() => { setShowForm(false); loadTeachers(); }}
        />
      )}

      <table className="w-full border border-[#0a1a44] rounded overflow-hidden">
        <thead>
          <tr className="bg-[#0a1a44] text-white">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Phone</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((t, idx) => (
            <tr
              key={t._id}
              className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
            >
              <td className="p-3">{t.fullName}</td>
              <td className="p-3">{t.email}</td>
              <td className="p-3">{t.phone || "-"}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    t.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {t.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="p-3">
                <button
                  onClick={() => { setEditTeacher(t); setShowForm(true); }}
                  className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherList;
