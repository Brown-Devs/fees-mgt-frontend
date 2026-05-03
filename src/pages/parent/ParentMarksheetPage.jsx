// src/pages/parent/ParentMarksheetPage.jsx
import React, { useEffect, useState } from "react";
import api from "../../apis/axios";
import { useStudentByParent } from "./hooks/useStudentByParent";
import { PageShell, Card, Spinner, ErrorBox, EmptyState } from "./components/ui";

const gradeFromPct = p =>
  p >= 90 ? "A+" : p >= 75 ? "A" : p >= 60 ? "B" : p >= 45 ? "C" : p >= 33 ? "D" : "F";

const gradeColor = g =>
  ({ "A+": "text-emerald-600", A: "text-green-600", B: "text-blue-600",
     C: "text-amber-600",     D: "text-orange-500", F: "text-red-600" })[g] || "text-slate-600";

export default function ParentMarksheetPage() {
  const { student, loading: sLoad, error: sErr } = useStudentByParent();
  const [marksheets, setMarksheets] = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);

  useEffect(() => {
    if (!student) return;
    setLoading(true);
    api.get(`/api/marksheets/student/${student._id}`)
      .then(res => setMarksheets(res.data.data || []))
      .catch(err => setError(err?.response?.data?.message || "Failed to load marksheets"))
      .finally(() => setLoading(false));
  }, [student]);

  if (sLoad || loading) return <Spinner />;
  if (sErr || error)    return <ErrorBox message={sErr || error} />;

  const getTotals = subjects => {
    const obtained = subjects.reduce((a, s) => a + Number(s.obtainedMarks), 0);
    const full     = subjects.reduce((a, s) => a + Number(s.fullMarks), 0);
    const p        = full ? parseFloat(((obtained / full) * 100).toFixed(1)) : 0;
    return { obtained, full, p, g: gradeFromPct(p), pass: p >= 33 };
  };

  return (
    <PageShell title="Marksheet" subtitle="Examination results and subject-wise marks">
      {marksheets.length === 0 ? (
        <Card><EmptyState message="No marksheets available yet." /></Card>
      ) : (
        marksheets.map(m => {
          const { obtained, full, p, g, pass } = getTotals(m.subjects || []);
          return (
            <Card key={m._id} className="overflow-hidden p-0">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#0a1a44] to-[#1a3a8f] px-5 py-4 flex justify-between items-center flex-wrap gap-3">
                <div>
                  <p className="text-white font-bold text-base">{m.examTypeId?.name}</p>
                  <p className="text-white/70 text-xs mt-0.5">
                    {m.classId?.name}
                    {m.classId?.section ? ` – ${m.classId.section}` : ""}
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="bg-white/10 rounded-xl px-4 py-2 text-center">
                    <p className="text-white font-bold text-lg leading-tight">
                      {obtained}
                      <span className="text-white/50 text-sm font-normal">/{full}</span>
                    </p>
                    <p className="text-white/60 text-xs">{p}%</p>
                  </div>
                  <div className="bg-white/10 rounded-xl px-4 py-2 text-center">
                    <p className={`font-bold text-xl leading-tight ${g === "F" ? "text-red-300" : "text-emerald-300"}`}>{g}</p>
                    <p className={`text-xs font-semibold ${pass ? "text-emerald-300" : "text-red-300"}`}>
                      {pass ? "Pass" : "Fail"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Subjects table */}
              <div className="px-5 py-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50">
                      {["#","Subject","Full Marks","Obtained","%","Grade"].map(h => (
                        <th key={h} className="px-3 py-2.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wide first:rounded-l-lg last:rounded-r-lg">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(m.subjects || []).map((s, i) => {
                      const subPct   = s.fullMarks ? parseFloat(((Number(s.obtainedMarks) / Number(s.fullMarks)) * 100).toFixed(1)) : 0;
                      const subGrade = gradeFromPct(subPct);
                      const fail     = subPct < 33;
                      return (
                        <tr key={i} className={`border-t border-slate-50 ${fail ? "bg-red-50/40" : ""}`}>
                          <td className="px-3 py-2.5 text-slate-400 text-xs">{i + 1}</td>
                          <td className="px-3 py-2.5 font-medium text-slate-800">{s.name}</td>
                          <td className="px-3 py-2.5 text-slate-500">{s.fullMarks}</td>
                          <td className={`px-3 py-2.5 font-bold ${fail ? "text-red-600" : "text-[#0a1a44]"}`}>{s.obtainedMarks}</td>
                          <td className="px-3 py-2.5 text-slate-400 text-xs">{subPct}%</td>
                          <td className={`px-3 py-2.5 font-bold text-xs ${gradeColor(subGrade)}`}>{subGrade}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  {/* Totals */}
                  <tfoot>
                    <tr className="border-t-2 border-slate-200 bg-slate-50">
                      <td colSpan={2} className="px-3 py-3 text-xs font-bold text-slate-600 uppercase tracking-wide">Total</td>
                      <td className="px-3 py-3 font-bold text-slate-700">{full}</td>
                      <td className="px-3 py-3 font-bold text-[#0a1a44]">{obtained}</td>
                      <td className="px-3 py-3 font-bold text-slate-700">{p}%</td>
                      <td className={`px-3 py-3 font-bold text-sm ${gradeColor(g)}`}>{g}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {m.updatedAt && (
                <p className="px-5 pb-4 text-xs text-slate-400">
                  Last updated: {new Date(m.updatedAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}
                </p>
              )}
            </Card>
          );
        })
      )}
    </PageShell>
  );
}
