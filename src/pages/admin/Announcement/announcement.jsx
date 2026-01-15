import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]); // ✅ always an array
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    targetDashboards: ["all"],
    date: ""
  });

  // Fetch announcements safely
  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get("/api/announcements", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setAnnouncements(res.data?.data || []); // ✅ fallback to []
    } catch (err) {
      console.error("Error fetching announcements:", err);
      setAnnouncements([]); // ✅ prevent undefined
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`/api/announcements/${editing}`, form, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
      } else {
        await axios.post("/api/announcements", form, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
      }
      setForm({ title: "", content: "", targetDashboards: ["all"], date: "" });
      setEditing(null);
      fetchAnnouncements();
    } catch (err) {
      console.error("Error saving announcement:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/announcements/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      fetchAnnouncements();
    } catch (err) {
      console.error("Error deleting announcement:", err);
    }
  };

  const handleEdit = (a) => {
    setForm({
      title: a.title,
      content: a.content,
      targetDashboards: a.targetDashboards || ["all"],
      date: a.date ? new Date(a.date).toISOString().split("T")[0] : ""
    });
    setEditing(a._id);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-navy-700 text-2xl font-bold mb-6">
        Manage Announcements
      </h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded p-6 mb-6"
      >
        <label className="block text-navy-600 mb-2">Title</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border border-lightblue-300 rounded px-3 py-2 w-full mb-4"
        />

        <label className="block text-navy-600 mb-2">Date</label>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="border border-lightblue-300 rounded px-3 py-2 w-full mb-4"
        />

        <label className="block text-navy-600 mb-2">Target Dashboard</label>
        <select
          value={form.targetDashboards[0]}
          onChange={(e) =>
            setForm({ ...form, targetDashboards: [e.target.value] })
          }
          className="border border-lightblue-300 rounded px-3 py-2 w-full mb-4"
        >
          <option value="all">All Dashboard</option>
          <option value="admin">Admin</option>
          <option value="teacher">Teacher</option>
          <option value="accountant">Accountant</option>
          <option value="parent">Parent</option>
        </select>

        <label className="block text-navy-600 mb-2">Content</label>
        <textarea
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="border border-lightblue-300 rounded px-3 py-2 w-full mb-4"
          rows="4"
        />

        {/* ✅ Submit button */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {editing ? "Update Announcement" : "Create Announcement"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setForm({
                  title: "",
                  content: "",
                  targetDashboards: ["all"],
                  date: ""
                });
                setEditing(null);
              }}
              className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* List */}
      <div className="bg-white shadow-md rounded p-6">
        <h2 className="text-navy-700 text-xl font-bold mb-4">
          Existing Announcements
        </h2>
        {Array.isArray(announcements) && announcements.length > 0 ? (
          announcements.map((a) => (
            <div
              key={a._id}
              className="border-b border-lightblue-200 py-3 flex justify-between items-center"
            >
              <div>
                <p className="text-navy-700 font-semibold">{a.title}</p>
                <p className="text-gray-700">{a.content}</p>
                <p className="text-sm text-lightblue-600">
                  {a.date
                    ? new Date(a.date).toLocaleDateString()
                    : "No date"}{" "}
                  — {(a.targetDashboards || []).join(", ")}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  className="text-lightblue-600 hover:text-navy-700"
                  onClick={() => handleEdit(a)}
                >
                  Edit
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(a._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No announcements yet.</p>
        )}
      </div>
    </div>
  );
}
