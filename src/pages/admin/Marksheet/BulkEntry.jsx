import React, { useState, useEffect } from "react";
import api from "../../../apis/axios";

export default function BulkEntry({ examTypeId, classId, students, subjects }) {
  const [marks, setMarks]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [msg, setMsg]         = useState("");

  /* Build initial state, merging any existing saved marks */
  useEffect(() => {
    setLoading(true);
    api.get(`/api/marksheets?classId=${classId}&examTypeId=${examTypeId}`)
      .then(res => {
        const existing = res.data.data || [];
        const rows = students.map(stu => {
          const found = existing.find(
            m => m.studentId?._id === stu._id || m.studentId === stu._id
          );
          return {
            studentId: stu._id,
            existingId: found?._id || null,
            subjects: subjects.map(s => {
              const saved = found?.subjects.find(fs => fs.name === s.name);
              return {
                name:          s.name,
                fullMarks:     Number(s.fullMarks),
                obtainedMarks: saved ? saved.obtainedMarks : ""
              };
            })
          };
        });
        setMarks(rows);
      })
      .catch(() => {
        setMarks(students.map(stu => ({
          studentId: stu._id,
          existingId: null,
          subjects: subjects.map(s => ({ name: s.name, fullMarks: Number(s.fullMarks), obtainedMarks: "" }))
        })));
      })
      .finally(() => setLoading(false));
  }, [examTypeId, classId, students, subjects]);

  const handleChange = (rIdx, cIdx, val) => {
    setMarks(prev => {
      const copy = prev.map(r => ({ ...r, subjects: [...r.subjects] }));
      copy[rIdx].subjects[cIdx] = { ...copy[rIdx].subjects[cIdx], obtainedMarks: val };
      return copy;
    });
  };

  const handleSubmit = async () => {
    // Validate
    for (let r = 0; r < marks.length; r++) {
      for (let c = 0; c < marks[r].subjects.length; c++) {
        const sub = marks[r].subjects[c];
        const val = Number(sub.obtainedMarks);
        if (sub.obtainedMarks === "" || sub.obtainedMarks === undefined) {
          return setMsg(`⚠️ ${students[r].firstName}: enter marks for ${sub.name}`);
        }
        if (val < 0 || val > sub.fullMarks) {
          return setMsg(`⚠️ ${students[r].firstName} – ${sub.name}: must be 0–${sub.fullMarks}`);
        }
      }
    }

    setSaving(true);
    setMsg("");
    try {
      await api.post("/api/marksheets/bulk", {
        examTypeId,
        classId,
        marksheets: marks.map(m => ({
          studentId: m.studentId,
          subjects:  m.subjects.map(s => ({ ...s, obtainedMarks: Number(s.obtainedMarks) }))
        }))
      });
      setMsg("✅ All marks saved successfully!");
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.message || "Failed to save"));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRow = async (rIdx) => {
    const row = marks[rIdx];
    if (!row.existingId) return;
    if (!window.confirm(`Delete marks for ${students[rIdx].firstName}?`)) return;
    try {
      await api.delete(`/api/marksheets/${row.existingId}`);
      setMarks(prev => {
        const copy = [...prev];
        copy[rIdx] = { ...copy[rIdx], existingId: null, subjects: copy[rIdx].subjects.map(s => ({ ...s, obtainedMarks: "" })) };
        return copy;
      });
      setMsg("🗑️ Deleted");
    } catch {
      setMsg("❌ Failed to delete");
    }
  };

  if (loading) return <p className="text-sm text-gray-500 py-6 text-center">Loading existing marks...</p>;

  return (
    <div className="bg-white border rounded-xl shadow-sm p-5 overflow-x-auto">
      <h3 className="text-lg font-semibold mb-4">Bulk Entry</h3>

      <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden min-w-[700px]">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-3 text-left">Student</th>
            {subjects.map((s, i) => (
              <th key={i} className="px-4 py-3 text-center">
                {s.name}
                <div className="text-xs text-gray-400 font-normal">/ {s.fullMarks}</div>
              </th>
            ))}
            <th className="px-4 py-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {marks.map((row, rIdx) => (
            <tr key={row.studentId}
              className={`border-t hover:bg-gray-50 ${row.existingId ? "bg-green-50" : ""}`}>
              <td className="px-4 py-3 font-medium">
                <div>{students[rIdx].firstName} {students[rIdx].lastName}</div>
                <div className="text-xs text-gray-400">Roll: {students[rIdx].rollNo}</div>
                {row.existingId && (
                  <span className="text-xs text-green-600">● saved</span>
                )}
              </td>
              {row.subjects.map((sub, cIdx) => (
                <td key={cIdx} className="px-4 py-2 text-center">
                  <input
                    type="number"
                    min={0}
                    max={sub.fullMarks}
                    className="w-16 border border-gray-300 rounded-md px-2 py-1 text-center
                               focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={sub.obtainedMarks}
                    onChange={e => handleChange(rIdx, cIdx, e.target.value)}
                  />
                </td>
              ))}
              <td className="px-4 py-2 text-center">
                {row.existingId && (
                  <button onClick={() => handleDeleteRow(rIdx)}
                    className="text-red-500 hover:text-red-700 text-xs font-medium">
                    🗑️ Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {msg && (
        <p className={`mt-3 text-sm font-medium ${msg.startsWith("✅") ? "text-green-600" : "text-red-500"}`}>
          {msg}
        </p>
      )}

      <div className="mt-4 text-right">
        <button onClick={handleSubmit} disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? "Saving..." : "💾 Save All"}
        </button>
      </div>
    </div>
  );
}