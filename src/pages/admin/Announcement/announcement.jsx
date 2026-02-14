import React, { useEffect, useState } from "react";
import api from "../../../apis/axios";
import PageHeader from "../../../components/common/PageHeader";
import TableCard from "../../../components/common/TableCard";

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [classes, setClasses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    title: "",
    content: "",
    targetDashboards: ["all"],
    targetClass: "",
    date: ""
  });

  // ================= FETCH =================
  const fetchAnnouncements = async () => {
    const res = await api.get("/api/announcements");
    setAnnouncements(res.data?.data || []);
  };

  const fetchClasses = async () => {
    const res = await api.get("/api/classes");
    setClasses(res.data?.data || []);
  };

  useEffect(() => {
    fetchAnnouncements();
    fetchClasses();
  }, []);

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      targetClass:
        form.targetDashboards[0] === "class"
          ? form.targetClass
          : ""
    };

    if (editing) {
      await api.put(`/api/announcements/${editing}`, payload);
    } else {
      await api.post("/api/announcements", payload);
    }

    resetForm();
    fetchAnnouncements();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this announcement?")) return;
    await api.delete(`/api/announcements/${id}`);
    fetchAnnouncements();
  };

  const handleEdit = (a) => {
    setForm({
      title: a.title,
      content: a.content,
      targetDashboards: a.targetDashboards || ["all"],
      targetClass: a.targetClass || "",
      date: a.date
        ? new Date(a.date).toISOString().split("T")[0]
        : ""
    });
    setEditing(a._id);
    setModalOpen(true);
  };

  const resetForm = () => {
    setForm({
      title: "",
      content: "",
      targetDashboards: ["all"],
      targetClass: "",
      date: ""
    });
    setEditing(null);
    setModalOpen(false);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/80 py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Header */}
          <PageHeader
            title="Announcements"
            subtitle="Create and manage dashboard announcements."
            buttonText="+ Create Announcement"
            onButtonClick={() => setModalOpen(true)}
          />

          {/* List */}
          <TableCard title="Announcement List">
            {announcements.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No announcements created yet.
              </p>
            ) : (
              <div className="divide-y">
                {announcements.map((a) => (
                  <div
                    key={a._id}
                    className="py-4 flex justify-between items-start"
                  >
                    <div>
                      <p className="font-semibold text-[#001f3f]">
                        {a.title}
                      </p>
                      <p className="text-gray-700 text-sm">
                        {a.content}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {a.date
                          ? new Date(a.date).toLocaleDateString()
                          : "No date"}{" "}
                        ·{" "}
                        {a.targetDashboards?.[0] === "class"
                          ? `Class: ${
                              a.targetClass === "all"
                                ? "All Classes"
                                : a.targetClass
                            }`
                          : a.targetDashboards?.[0] || "All"}
                      </p>
                    </div>

                    <div className="space-x-3">
                      <button
                        onClick={() => handleEdit(a)}
                        className="text-[#001f3f] font-medium hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(a._id)}
                        className="text-rose-600 font-medium hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TableCard>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[500px] p-6 space-y-4">
            <h3 className="text-xl font-semibold text-[#001f3f]">
              {editing ? "Edit Announcement" : "Create Announcement"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                type="text"
                placeholder="Title"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                required
              />

              <input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm({ ...form, date: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-xl"
              />

              {/* TARGET DASHBOARD */}
              <select
                value={form.targetDashboards[0]}
                onChange={(e) =>
                  setForm({
                    ...form,
                    targetDashboards: [e.target.value],
                    targetClass: ""
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-xl"
              >
                <option value="all">All Dashboards</option>
                <option value="admin">Admin</option>
                <option value="teacher">Teacher</option>
                <option value="accountant">Accountant</option>
                <option value="parent">Parent</option>
                <option value="class">Class</option>
              </select>

              {/* CLASS DROPDOWN */}
              {form.targetDashboards[0] === "class" && (
                <select
                  value={form.targetClass}
                  onChange={(e) =>
                    setForm({ ...form, targetClass: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                  required
                >
                  <option value="">Select Class</option>
                  <option value="all">All Classes</option>
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls.name}>
                      {cls.name}{" "}
                      {cls.section ? `- ${cls.section}` : ""}
                    </option>
                  ))}
                </select>
              )}

              <textarea
                rows="4"
                placeholder="Content"
                value={form.content}
                onChange={(e) =>
                  setForm({ ...form, content: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                required
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#001f3f] text-white rounded-xl hover:bg-[#001933]"
                >
                  {editing ? "Update" : "Create"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
}
