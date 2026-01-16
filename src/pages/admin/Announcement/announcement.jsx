import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    targetDashboards: ["all"],
    date: ""
  });

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get("/api/announcements", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setAnnouncements(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching announcements:", err);
      setAnnouncements([]);
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

  const Label = ({ text }) => (
    <label className="text-xs font-semibold text-gray-600 mb-1 block">
      {text}
    </label>
  );

  return (
    <div className="p-6 bg-[#f5f7fb] min-h-screen">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#0a1a44]">
            Announcements
          </h1>
          <p className="text-sm text-gray-500">
            Create and manage dashboard announcements
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow p-6 mb-6"
        >
          <h2 className="text-lg font-semibold text-[#0a1a44] mb-4">
            {editing ? "Edit Announcement" : "Create Announcement"}
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="col-span-2">
              <Label text="Title" />
              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                className="input-style"
              />
            </div>

            <div>
              <Label text="Date" />
              <input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm({ ...form, date: e.target.value })
                }
                className="input-style"
              />
            </div>

            <div>
              <Label text="Target Dashboard" />
              <select
                value={form.targetDashboards[0]}
                onChange={(e) =>
                  setForm({
                    ...form,
                    targetDashboards: [e.target.value]
                  })
                }
                className="input-style"
              >
                <option value="all">All Dashboards</option>
                <option value="admin">Admin</option>
                <option value="teacher">Teacher</option>
                <option value="accountant">Accountant</option>
                <option value="parent">Parent</option>
              </select>
            </div>

            <div className="col-span-2">
              <Label text="Content" />
              <textarea
                rows="4"
                value={form.content}
                onChange={(e) =>
                  setForm({ ...form, content: e.target.value })
                }
                className="input-style resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-[#0a1a44] text-white hover:bg-[#122a6f]"
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
                className="px-6 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* List */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold text-[#0a1a44] mb-4">
            Existing Announcements
          </h2>

          {Array.isArray(announcements) && announcements.length > 0 ? (
            announcements.map((a) => (
              <div
                key={a._id}
                className="border-b last:border-b-0 py-4 flex justify-between gap-4"
              >
                <div>
                  <p className="font-semibold text-[#0a1a44]">
                    {a.title}
                  </p>
                  <p className="text-gray-700 text-sm">
                    {a.content}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {a.date
                      ? new Date(a.date).toLocaleDateString()
                      : "No date"}{" "}
                    · {(a.targetDashboards || []).join(", ")}
                  </p>
                </div>

                <div className="flex gap-3 items-start">
                  <button
                    onClick={() => handleEdit(a)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(a._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">
              No announcements created yet.
            </p>
          )}
        </div>
      </div>

      <style>{`
        .input-style {
          padding: 0.6rem;
          border: 1px solid #dbe2f1;
          border-radius: 0.5rem;
          width: 100%;
        }
        .input-style:focus {
          outline: none;
          border-color: #0a1a44;
          box-shadow: 0 0 0 2px rgba(10,26,68,0.15);
        }
      `}</style>
    </div>
  );
}
