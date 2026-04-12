import React, { useState } from "react";
import api from "../../../apis/axios";

export default function ViewMarksheets({ examTypes, classes }) {
  const [filterExam,    setFilterExam]    = useState("");
  const [filterClass,   setFilterClass]   = useState("");
  const [marksheets,    setMarksheets]    = useState([]);
  const [loading,       setLoading]       = useState(false);
  const [fetched,       setFetched]       = useState(false);
  const [editingId,     setEditingId]     = useState(null);
  const [editSubjects,  setEditSubjects]  = useState([]);
  const [msg,           setMsg]           = useState({ text: "", type: "" });

  const showMsg = (text, type = "error") => setMsg({ text, type });
  const clearMsg = () => setMsg({ text: "", type: "" });

  /* ── Fetch ── */
  const fetchMarksheets = async () => {
    if (!filterExam || !filterClass) return;
    setLoading(true);
    clearMsg();
    setEditingId(null);
    try {
      const res = await api.get(
        `/api/marksheets?classId=${filterClass}&examTypeId=${filterExam}`
      );
      setMarksheets(res.data.data || []);
      setFetched(true);
    } catch {
      showMsg("Failed to fetch marksheets.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Edit ── */
  const startEdit  = (m) => { setEditingId(m._id); setEditSubjects(m.subjects.map(s => ({ ...s }))); clearMsg(); };
  const cancelEdit = ()  => { setEditingId(null); setEditSubjects([]); };

  const saveEdit = async (id) => {
    for (const s of editSubjects) {
      if (s.obtainedMarks === "" || s.obtainedMarks === undefined)
        return showMsg(`Enter marks for ${s.name}`);
      if (Number(s.obtainedMarks) < 0 || Number(s.obtainedMarks) > s.fullMarks)
        return showMsg(`${s.name}: marks must be between 0 and ${s.fullMarks}`);
    }
    try {
      const res = await api.put(`/api/marksheets/${id}`, {
        subjects: editSubjects.map(s => ({ ...s, obtainedMarks: Number(s.obtainedMarks) }))
      });
      setMarksheets(prev => prev.map(m => m._id === id ? res.data.data : m));
      setEditingId(null);
      showMsg("Marks updated successfully.", "success");
    } catch {
      showMsg("Failed to update marks.");
    }
  };

  /* ── Delete ── */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this marksheet?")) return;
    try {
      await api.delete(`/api/marksheets/${id}`);
      setMarksheets(prev => prev.filter(m => m._id !== id));
      showMsg("Marksheet deleted.", "success");
    } catch {
      showMsg("Failed to delete.");
    }
  };

  /* ── Helpers ── */
  const getTotals = (subjects) => {
    const obtained = subjects.reduce((a, s) => a + Number(s.obtainedMarks), 0);
    const full     = subjects.reduce((a, s) => a + Number(s.fullMarks), 0);
    const pct      = full ? ((obtained / full) * 100).toFixed(1) : "0.0";
    const grade    = pct >= 90 ? "A+" : pct >= 75 ? "A" : pct >= 60 ? "B"
                   : pct >= 45 ? "C"  : pct >= 33 ? "D" : "F";
    const pass     = pct >= 33;
    return { obtained, full, pct, grade, pass };
  };

  const gradeColor = (grade) => {
    const map = { "A+": "text-emerald-600", A: "text-green-600", B: "text-blue-600",
                  C: "text-yellow-600",     D: "text-orange-500", F: "text-red-600" };
    return map[grade] || "text-gray-600";
  };

  return (
    <div className="space-y-5">

      {/* ── Filter Bar ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">
          Filter Marksheets
        </h3>
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">Exam Type</label>
            <select
              className="input w-52"
              value={filterExam}
              onChange={e => { setFilterExam(e.target.value); setFetched(false); setMarksheets([]); setEditingId(null); }}
            >
              <option value="">Select Exam</option>
              {examTypes.map(et => <option key={et._id} value={et._id}>{et.name}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">Class</label>
            <select
              className="input w-60"
              value={filterClass}
              onChange={e => { setFilterClass(e.target.value); setFetched(false); setMarksheets([]); setEditingId(null); }}
            >
              <option value="">Select Class</option>
              {classes.map(c => (
                <option key={c._id} value={c._id}>
                  {c.name} ({c.section} – {c.stream})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={fetchMarksheets}
            disabled={!filterExam || !filterClass || loading}
            className="btn-primary h-10 px-6 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </div>
      </div>

      {/* ── Global Message ── */}
      {msg.text && (
        <div className={`rounded-xl px-4 py-3 text-sm font-medium border ${
          msg.type === "success"
            ? "bg-green-50 text-green-700 border-green-200"
            : "bg-red-50 text-red-600 border-red-200"
        }`}>
          {msg.text}
        </div>
      )}

      {/* ── Empty State ── */}
      {fetched && marksheets.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-gray-400 font-medium">No marksheets found for this selection.</p>
          <p className="text-gray-300 text-sm mt-1">Try selecting a different exam or class.</p>
        </div>
      )}

      {/* ── Marksheet Cards ── */}
      {marksheets.map((m) => {
        const stu   = m.studentId;
        const isEd  = editingId === m._id;
        const subs  = isEd ? editSubjects : m.subjects;
        const { obtained, full, pct, grade, pass } = getTotals(m.subjects);

        return (
          <div key={m._id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            {/* ── Card Header ── */}
            <div className="bg-[#0b1f3a] px-6 py-4 flex justify-between items-center">
              <div>
                <p className="text-white font-semibold text-base">
                  {stu?.firstName} {stu?.lastName}
                </p>
                <p className="text-blue-200 text-xs mt-0.5">
                  Roll No: {stu?.rollNo}&nbsp;&nbsp;|&nbsp;&nbsp;
                  {m.examTypeId?.name}&nbsp;&nbsp;|&nbsp;&nbsp;
                  {m.classId?.name} {m.classId?.section}
                </p>
              </div>

              {/* Score Badge */}
              {!isEd && (
                <div className="text-right">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 rounded-xl px-4 py-2 text-center">
                      <p className="text-white text-lg font-bold leading-tight">
                        {obtained}<span className="text-blue-300 text-sm font-normal">/{full}</span>
                      </p>
                      <p className="text-blue-200 text-xs">{pct}%</p>
                    </div>
                    <div className={`bg-white/10 rounded-xl px-4 py-2 text-center`}>
                      <p className={`text-xl font-bold leading-tight ${
                        grade === "F" ? "text-red-300" : "text-emerald-300"
                      }`}>
                        {grade}
                      </p>
                      <p className={`text-xs font-medium ${pass ? "text-emerald-300" : "text-red-300"}`}>
                        {pass ? "Pass" : "Fail"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Subjects Table ── */}
            <div className="px-6 py-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider w-8">
                      #
                    </th>
                    <th className="text-left py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="text-center py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider w-28">
                      Full Marks
                    </th>
                    <th className="text-center py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider w-28">
                      Obtained
                    </th>
                    <th className="text-center py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider w-24">
                      %
                    </th>
                    <th className="text-center py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider w-20">
                      Grade
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {subs.map((s, i) => {
                    const subPct   = s.fullMarks ? ((Number(s.obtainedMarks) / Number(s.fullMarks)) * 100).toFixed(1) : "0.0";
                    const subGrade = subPct >= 90 ? "A+" : subPct >= 75 ? "A" : subPct >= 60 ? "B"
                                   : subPct >= 45 ? "C"  : subPct >= 33 ? "D" : "F";

                    return (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 text-gray-400 text-xs">{i + 1}</td>

                        <td className="py-3">
  <span className="font-medium text-gray-800">{s.name}</span>
</td>

                        <td className="py-3 text-center text-gray-600">{s.fullMarks}</td>

                        <td className="py-3 text-center">
                          {isEd ? (
                            <input
                              type="number"
                              min={0}
                              max={s.fullMarks}
                              className="w-20 border border-gray-300 rounded-lg px-2 py-1 text-center
                                         focus:ring-2 focus:ring-[#0b1f3a] focus:border-transparent
                                         focus:outline-none text-sm font-medium"
                              value={s.obtainedMarks}
                              onChange={e => {
                                const copy = [...editSubjects];
                                copy[i] = { ...copy[i], obtainedMarks: e.target.value };
                                setEditSubjects(copy);
                              }}
                            />
                          ) : (
                            <span className={`font-semibold ${
                              Number(s.obtainedMarks) < s.fullMarks * 0.33
                                ? "text-red-500"
                                : "text-gray-800"
                            }`}>
                              {s.obtainedMarks}
                            </span>
                          )}
                        </td>

                        <td className="py-3 text-center text-gray-500 text-xs">{subPct}%</td>

                        <td className="py-3 text-center">
                          <span className={`text-xs font-bold ${gradeColor(subGrade)}`}>
                            {subGrade}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

                {/* ── Totals Row ── */}
                {!isEd && (
                  <tfoot>
                    <tr className="border-t-2 border-gray-200 bg-gray-50">
                      <td colSpan={2} className="py-3 px-0 text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Total
                      </td>
                      <td className="py-3 text-center font-bold text-gray-700">{full}</td>
                      <td className="py-3 text-center font-bold text-[#0b1f3a]">{obtained}</td>
                      <td className="py-3 text-center font-bold text-gray-700">{pct}%</td>
                      <td className="py-3 text-center">
                        <span className={`text-sm font-bold ${gradeColor(grade)}`}>{grade}</span>
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            {/* ── Card Footer / Actions ── */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
              <p className="text-xs text-gray-400">
                Last updated: {new Date(m.updatedAt).toLocaleDateString("en-IN", {
                  day: "numeric", month: "short", year: "numeric"
                })}
              </p>

              <div className="flex gap-2">
                {isEd ? (
                  <>
                    <button
                      onClick={() => saveEdit(m._id)}
                      className="btn-primary text-xs py-1.5 px-4"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="btn-outline text-xs py-1.5 px-4"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(m)}
                      className="btn-outline text-xs py-1.5 px-4"
                    >
                      Edit Marks
                    </button>
                    <button
                      onClick={() => handleDelete(m._id)}
                      className="text-xs py-1.5 px-4 rounded-lg border border-red-200
                                 text-red-500 hover:bg-red-50 hover:text-red-700 transition font-medium"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
}