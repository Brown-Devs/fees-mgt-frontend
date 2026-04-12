import React, { useState, useEffect } from "react";
import api from "../../../apis/axios";

export default function SingleEntry({ examTypeId, classId, student, subjects }) {
  const [marks, setMarks]       = useState({});
  const [existingId, setExistingId] = useState(null); // marksheet _id if already saved
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [msg, setMsg]           = useState("");

  /* Load existing marks for this student+exam+class */
  useEffect(() => {
    setLoading(true);
    setMsg("");
    api.get(`/api/marksheets?classId=${classId}&examTypeId=${examTypeId}`)
      .then(res => {
        const found = (res.data.data || []).find(
          m => m.studentId?._id === student._id || m.studentId === student._id
        );
        if (found) {
          setExistingId(found._id);
          const m = {};
          found.subjects.forEach(s => { m[s.name] = s.obtainedMarks; });
          setMarks(m);
        } else {
          setExistingId(null);
          setMarks({});
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [examTypeId, classId, student._id]);

  const handleSubmit = async () => {
    // Validate
    for (const s of subjects) {
      const val = Number(marks[s.name]);
      if (marks[s.name] === "" || marks[s.name] === undefined) {
        return setMsg(`⚠️ Enter marks for ${s.name}`);
      }
      if (val < 0 || val > Number(s.fullMarks)) {
        return setMsg(`⚠️ ${s.name}: marks must be between 0 and ${s.fullMarks}`);
      }
    }

    const formatted = subjects.map(s => ({
      name:          s.name,
      fullMarks:     Number(s.fullMarks),
      obtainedMarks: Number(marks[s.name])
    }));

    setSaving(true);
    setMsg("");
    try {
      if (existingId) {
        await api.put(`/api/marksheets/${existingId}`, { subjects: formatted });
      } else {
        const res = await api.post("/api/marksheets", {
          examTypeId, classId, studentId: student._id, subjects: formatted
        });
        setExistingId(res.data.data._id);
      }
      setMsg("✅ Marks saved successfully!");
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.message || "Failed to save"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!existingId) return;
    if (!window.confirm("Delete marks for this student?")) return;
    try {
      await api.delete(`/api/marksheets/${existingId}`);
      setExistingId(null);
      setMarks({});
      setMsg("🗑️ Deleted successfully");
    } catch {
      setMsg("❌ Failed to delete");
    }
  };

  if (loading) return <p className="text-sm text-gray-500 py-4">Loading...</p>;

  return (
    <div className="bg-white border rounded-xl shadow-sm p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          {student.firstName} {student.lastName}
          <span className="ml-2 text-sm text-gray-500">Roll: {student.rollNo}</span>
        </h3>
        {existingId && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
            Marks on record
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Subject</th>
              <th className="px-4 py-3 text-center">Full Marks</th>
              <th className="px-4 py-3 text-center">Obtained Marks</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((s, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{s.name}</td>
                <td className="px-4 py-3 text-center">{s.fullMarks}</td>
                <td className="px-4 py-3 text-center">
                  <input
                    type="number"
                    min={0}
                    max={s.fullMarks}
                    className="w-20 border border-gray-300 rounded-md px-2 py-1 text-center
                               focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={marks[s.name] ?? ""}
                    onChange={e => setMarks({ ...marks, [s.name]: e.target.value })}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {msg && (
        <p className={`mt-3 text-sm font-medium ${msg.startsWith("✅") ? "text-green-600" : "text-red-500"}`}>
          {msg}
        </p>
      )}

      <div className="mt-4 flex justify-between items-center">
        {existingId ? (
          <button onClick={handleDelete}
            className="text-red-500 hover:text-red-700 text-sm font-medium">
            🗑️ Delete Marks
          </button>
        ) : <span />}
        <button onClick={handleSubmit} disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? "Saving..." : existingId ? "Update Marks" : "Save Marks"}
        </button>
      </div>
    </div>
  );
}