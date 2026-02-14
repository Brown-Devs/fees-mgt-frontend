import React, { useEffect, useState } from "react";
import api from "../../../apis/axios";
import PageHeader from "../../../components/common/PageHeader";
import TableCard from "../../../components/common/TableCard";

const ClassList = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: "",
    section: "",
    stream: "Regular",
  });

  // ================= FETCH =================
  const fetchClasses = async () => {
    try {
      const res = await api.get("/api/classes");
      setClasses(res.data?.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load classes");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // ================= CREATE =================
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
        ...form,
      });

      setClasses((prev) => [...prev, res.data.data]);
      setForm({ name: "", section: "", stream: "Regular" });
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to create class");
    }

    setSubmitting(false);
  };

  // ================= DELETE =================
  const deleteClass = async (id) => {
    if (!window.confirm("Delete this class?")) return;

    try {
      await api.delete(`/api/classes/${id}`);
      setClasses((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete class");
    }
  };

  // ================= UPDATE =================
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
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/80 py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Page Header */}
          <PageHeader
            title="Class Management"
            subtitle="Create and manage academic classes efficiently."
            buttonText="+ Add Class"
            onButtonClick={() => setShowModal(true)}
          />

          {/* Table Section */}
          <TableCard title="Class List">
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Class
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Section
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Stream
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">
                      Actions
                    </th>
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
                        <td className="px-6 py-4 font-medium text-gray-800">
                          {cls.name}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {cls.section || "-"}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {cls.stream}
                        </td>
                        <td className="px-6 py-4 text-center space-x-3">
                          <button
                            onClick={() => setEditing(cls)}
                            className="text-[#001f3f] font-medium hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteClass(cls._id)}
                            className="text-rose-600 font-medium hover:underline"
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
          </TableCard>

        </div>
      </div>

      {/* ================= ADD CLASS MODAL ================= */}
      {showModal && (
        <Modal
          title="Add Class"
          form={form}
          setForm={setForm}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      )}

      {/* ================= EDIT CLASS MODAL ================= */}
      {editing && (
        <Modal
          title="Edit Class"
          form={editing}
          setForm={setEditing}
          onClose={() => setEditing(null)}
          onSubmit={updateClass}
        />
      )}
    </>
  );
};

/* ================= REUSABLE MODAL ================= */

const Modal = ({
  title,
  form,
  setForm,
  onClose,
  onSubmit,
  submitting,
}) => {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-[420px] p-6 space-y-4">
        <h3 className="text-xl font-semibold text-[#001f3f]">
          {title}
        </h3>

        <input
          type="text"
          placeholder="Class Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl"
        />

        <input
          type="text"
          placeholder="Section"
          value={form.section}
          onChange={(e) => setForm({ ...form, section: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl"
        />

        <select
          value={form.stream}
          onChange={(e) => setForm({ ...form, stream: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl"
        >
          <option value="Regular">Regular</option>
          <option value="Science">Science</option>
          <option value="Arts">Arts</option>
          <option value="Commerce">Commerce</option>
        </select>

        <div className="flex justify-end gap-3 pt-3">
          <button
            className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-[#001f3f] text-white rounded-xl hover:bg-[#001933]"
            onClick={onSubmit}
          >
            {submitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassList;
