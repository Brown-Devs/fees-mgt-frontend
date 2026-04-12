import React, { useEffect, useState } from "react";
import api from "../../../apis/axios";

const getGrade = (p) => {
  if (p >= 90) return "A+";
  if (p >= 75) return "A";
  if (p >= 60) return "B";
  if (p >= 45) return "C";
  if (p >= 33) return "D";
  return "F";
};

const gradeColor = (grade) => ({
  "A+": "text-emerald-600", A: "text-green-600",  B: "text-blue-600",
   C:   "text-yellow-600",  D: "text-orange-500", F: "text-red-600"
}[grade] || "text-gray-600");

const MarksSection = ({ student }) => {
  const [examTypes,   setExamTypes]   = useState([]);
  const [allSheets,   setAllSheets]   = useState([]); // all marksheets for student
  const [examTypeId,  setExamTypeId]  = useState("");
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");

  /* ── Fetch exam types ── */
  useEffect(() => {
    api.get("/api/exam-types")
      .then(res => setExamTypes(res.data.data || []))
      .catch(() => {});
  }, []);

  /* ── Fetch ALL marksheets for this student once ── */
  useEffect(() => {
    if (!student?._id) return;
    setLoading(true);
    setError("");
    api.get(`/api/marksheets/student/${student._id}`)
      .then(res => setAllSheets(res.data.data || []))
      .catch(() => setError("Failed to load marksheets."))
      .finally(() => setLoading(false));
  }, [student._id]);

  /* ── Filter on frontend by selected exam ── */
  const marksheet = examTypeId
    ? allSheets.find(
        m => (m.examTypeId?._id || m.examTypeId) === examTypeId
      ) || null
    : null;

  const subjects       = marksheet?.subjects || [];
  const totalObtained  = subjects.reduce((a, s) => a + Number(s.obtainedMarks || 0), 0);
  const totalMarks     = subjects.reduce((a, s) => a + Number(s.fullMarks || 0), 0);
  const percentage     = totalMarks ? ((totalObtained / totalMarks) * 100).toFixed(1) : "0.0";
  const grade          = getGrade(Number(percentage));
  const pass           = Number(percentage) >= 33;

  return (
    <div className="space-y-5">
      <h4 className="text-lg font-semibold text-[#0a1a44]">Report Card</h4>

      {/* ── Exam Selector ── */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-1 w-72">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Select Exam
          </label>
          <select
            className="input"
            value={examTypeId}
            onChange={e => setExamTypeId(e.target.value)}
          >
            <option value="">-- Choose an exam --</option>
            {examTypes.map(et => (
              <option key={et._id} value={et._id}>{et.name}</option>
            ))}
          </select>
        </div>

        {/* Quick stats chips — only when data available */}
        {marksheet && (
          <div className="flex gap-2 mt-5">
            <span className="bg-[#0b1f3a] text-white text-xs font-semibold px-3 py-1.5 rounded-lg">
              {totalObtained}/{totalMarks}
            </span>
            <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg">
              {percentage}%
            </span>
            <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${
              pass
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}>
              {pass ? "Pass" : "Fail"}
            </span>
          </div>
        )}
      </div>

      {/* ── Loading ── */}
      {loading && (
        <p className="text-sm text-gray-400 py-4">Loading marksheets...</p>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* ── No exam selected ── */}
      {!loading && !error && !examTypeId && (
        <div className="py-10 text-center border border-dashed border-gray-200 rounded-xl">
          <p className="text-gray-400 text-sm">Select an exam above to view marks.</p>
        </div>
      )}

      {/* ── Exam selected but no marks ── */}
      {!loading && !error && examTypeId && !marksheet && (
        <div className="py-10 text-center border border-dashed border-gray-200 rounded-xl">
          <p className="text-gray-400 font-medium text-sm">No marks found for this exam.</p>
          <p className="text-gray-300 text-xs mt-1">
            Marks will appear here once they are entered in the Marksheet module.
          </p>
        </div>
      )}

      {/* ── Marksheet Table ── */}
      {!loading && marksheet && subjects.length > 0 && (
        <div className="border border-gray-200 rounded-xl overflow-hidden">

          {/* Card Header */}
          <div className="bg-[#0b1f3a] px-5 py-3 flex justify-between items-center">
            <div>
              <p className="text-white font-semibold text-sm">
                {marksheet.examTypeId?.name}
              </p>
              <p className="text-blue-200 text-xs mt-0.5">
                {marksheet.classId?.name}
                {marksheet.classId?.section ? ` — Section ${marksheet.classId.section}` : ""}
                &nbsp;|&nbsp;
                {new Date(marksheet.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric", month: "short", year: "numeric"
                })}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white/10 rounded-xl px-4 py-2 text-center">
                <p className="text-white text-base font-bold leading-tight">
                  {totalObtained}
                  <span className="text-blue-300 text-xs font-normal">/{totalMarks}</span>
                </p>
                <p className="text-blue-200 text-xs">{percentage}%</p>
              </div>
              <div className="bg-white/10 rounded-xl px-4 py-2 text-center">
                <p className={`text-lg font-bold leading-tight ${
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

          {/* Table */}
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider w-8">
                  #
                </th>
                <th className="text-left px-5 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Subject
                </th>
                <th className="text-center py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider w-28">
                  Full Marks
                </th>
                <th className="text-center py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider w-28">
                  Obtained
                </th>
                <th className="text-center py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider w-20">
                  %
                </th>
                <th className="text-center py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider w-20">
                  Grade
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {subjects.map((s, i) => {
                const subPct   = s.fullMarks
                  ? ((Number(s.obtainedMarks) / Number(s.fullMarks)) * 100).toFixed(1)
                  : "0.0";
                const subGrade = getGrade(Number(subPct));

                return (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-gray-400 text-xs">{i + 1}</td>
                    <td className="px-5 py-3 font-medium text-gray-800">{s.name}</td>
                    <td className="py-3 text-center text-gray-600">{s.fullMarks}</td>
                    <td className="py-3 text-center">
                      <span className={`font-semibold ${
                        Number(s.obtainedMarks) < s.fullMarks * 0.33
                          ? "text-red-500"
                          : "text-gray-800"
                      }`}>
                        {s.obtainedMarks}
                      </span>
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

            {/* Totals Row */}
            <tfoot>
              <tr className="border-t-2 border-gray-200 bg-gray-50">
                <td colSpan={2} className="px-5 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Total
                </td>
                <td className="py-3 text-center font-bold text-gray-700">{totalMarks}</td>
                <td className="py-3 text-center font-bold text-[#0b1f3a]">{totalObtained}</td>
                <td className="py-3 text-center font-bold text-gray-700">{percentage}%</td>
                <td className="py-3 text-center">
                  <span className={`text-sm font-bold ${gradeColor(grade)}`}>{grade}</span>
                </td>
              </tr>
            </tfoot>
          </table>

        </div>
      )}
    </div>
  );
};

export default MarksSection;