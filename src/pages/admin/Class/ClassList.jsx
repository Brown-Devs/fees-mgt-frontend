import React, { useEffect, useState } from "react";
import api from "../../../apis/axios";

const ClassList = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    section: "",
    stream: "Regular",
  });

  const [editing, setEditing] = useState(null);

  // Fetch classes
  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/classes");
      setClasses(res.data.data);
    } catch (err) {
      console.error("Failed to load classes", err);
      alert("Failed to load classes");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // Create class
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const schoolId = user?.schoolId;
      const branchId = user?.branchId;

      const res = await api.post("/api/classes", {
        schoolId,
        branchId,
        name: form.name,
        section: form.section,
        stream: form.stream,
      });

      setClasses((prev) => [...prev, res.data.data]);
      setForm({ name: "", section: "", stream: "Regular" });
    } catch (err) {
      console.error(err);
      alert("Failed to create class");
    }

    setSubmitting(false);
  };

  // Delete class
  const deleteClass = async (id) => {
    if (!confirm("Delete this class?")) return;

    try {
      await api.delete(`/api/classes/${id}`);
      setClasses((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete class");
    }
  };

  // Update class
  const updateClass = async () => {
    try {
      const res = await api.put(`/api/classes/${editing._id}`, editing);

      setClasses((prev) =>
        prev.map((c) => (c._id === editing._id ? res.data.data : c))
      );

      setEditing(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update class");
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/80 py-8 px-4">
    <div className="max-w-6xl mx-auto space-y-8">

      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-[#001f3f]">
          Class Management
        </h1>
        <p className="text-gray-500 mt-1">
          Create and manage academic classes efficiently.
        </p>
      </div>

      {/* Create Class Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 max-w-lg space-y-5"
      >
        <div className="flex items-center gap-2 pb-4 border-b">
          <div className="w-1 h-6 bg-[#001f3f] rounded-full" />
          <h2 className="text-lg font-semibold text-[#001f3f]">
            Add New Class
          </h2>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Class Name *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl
                       focus:ring-2 focus:ring-[#001f3f]/20 focus:border-[#001f3f]"
          />

          <input
            type="text"
            placeholder="Section"
            value={form.section}
            onChange={(e) => setForm({ ...form, section: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl
                       focus:ring-2 focus:ring-[#001f3f]/20 focus:border-[#001f3f]"
          />

          <select
            value={form.stream}
            onChange={(e) => setForm({ ...form, stream: e.target.value })}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl
                       focus:ring-2 focus:ring-[#001f3f]/20 focus:border-[#001f3f]"
          >
            <option value="Regular">Regular</option>
            <option value="Science">Science</option>
            <option value="Arts">Arts</option>
            <option value="Commerce">Commerce</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-[#001f3f] hover:bg-[#001933]
                       text-white font-semibold rounded-xl
                       shadow-md hover:shadow-lg transition-all
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Saving..." : "Add Class"}
          </button>
        </div>
      </form>

      {/* Class Table */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
        <div className="flex items-center gap-2 pb-4 border-b mb-6">
          <div className="w-1 h-6 bg-[#001f3f] rounded-full" />
          <h2 className="text-lg font-semibold text-[#001f3f]">
            Existing Classes
          </h2>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Class</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Section</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Stream</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : classes.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-gray-400">
                    No classes found
                  </td>
                </tr>
              ) : (
                classes.map((cls) => (
                  <tr key={cls._id} className="hover:bg-[#001f3f]/[0.02]">
                    <td className="px-6 py-4 font-medium text-gray-800">{cls.name}</td>
                    <td className="px-6 py-4 text-gray-600">{cls.section || "-"}</td>
                    <td className="px-6 py-4 text-gray-600">{cls.stream}</td>

                    <td className="px-6 py-4 text-center space-x-2">
                      <button
                        onClick={() => setEditing(cls)}
                        className="px-3 py-1.5 bg-[#001f3f] text-white rounded-lg hover:bg-[#001933]"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteClass(cls._id)}
                        className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl w-[420px] p-6 space-y-4">
            <h3 className="text-xl font-semibold text-[#001f3f]">
              Edit Class
            </h3>

            <input
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl"
            />

            <input
              value={editing.section}
              onChange={(e) => setEditing({ ...editing, section: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl"
            />

            <select
              value={editing.stream}
              onChange={(e) => setEditing({ ...editing, stream: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl"
            >
              <option value="Regular">Regular</option>
              <option value="Science">Science</option>
              <option value="Arts">Arts</option>
              <option value="Commerce">Commerce</option>
            </select>

            <div className="flex justify-end gap-3 pt-3">
              <button
                onClick={updateClass}
                className="px-4 py-2 bg-[#001f3f] text-white rounded-xl hover:bg-[#001933]"
              >
                Save
              </button>

              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  </div>
);

};

export default ClassList;
