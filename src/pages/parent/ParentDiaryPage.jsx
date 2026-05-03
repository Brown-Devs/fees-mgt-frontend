// src/pages/parent/ParentDiaryPage.jsx
import React, { useEffect, useState } from "react";
import api from "../../apis/axios";
import { useStudentByParent } from "./hooks/useStudentByParent";
import { PageShell, Card, Spinner, ErrorBox, EmptyState } from "./components/ui";

export default function ParentDiaryPage() {
  const { student, loading: sLoad, error: sErr } = useStudentByParent();
  const [diary,   setDiary]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [openId,  setOpenId]  = useState(null);
  const [filter,  setFilter]  = useState("");

  useEffect(() => {
    if (!student) return;
    setLoading(true);
    api.get(`/api/diary/student/${student._id}`)
      .then(res => setDiary(res.data.data || []))
      .catch(err => setError(err?.response?.data?.message || "Failed to load diary"))
      .finally(() => setLoading(false));
  }, [student]);

  if (sLoad || loading) return <Spinner />;
  if (sErr || error)    return <ErrorBox message={sErr || error} />;

  const subjects = [...new Set(diary.map(d => d.subject).filter(Boolean))];
  const filtered = filter ? diary.filter(d => d.subject === filter) : diary;

  return (
    <PageShell title="School Diary" subtitle="Homework, notices, and teacher feedback">
      {/* Subject filter */}
      {subjects.length > 0 && (
        <Card className="py-3">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-semibold text-slate-500">Filter:</span>
            <button
              onClick={() => setFilter("")}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition
                ${!filter ? "bg-[#0a1a44] text-white border-[#0a1a44]" : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"}`}
            >
              All
            </button>
            {subjects.map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition
                  ${filter === s ? "bg-[#0a1a44] text-white border-[#0a1a44]" : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </Card>
      )}

      {filtered.length === 0 ? (
        <Card><EmptyState message="No diary entries found." /></Card>
      ) : (
        filtered.map(d => (
          <Card
            key={d._id}
            className="cursor-pointer hover:border-slate-300 transition"
            onClick={() => setOpenId(openId === d._id ? null : d._id)}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-lg flex-shrink-0">
                  📖
                </div>
                <div>
                  <p className="font-semibold text-[#0a1a44] text-sm">{d.subject || "General"}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {d.date
                      ? new Date(d.date).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })
                      : ""}
                  </p>
                </div>
              </div>
              <span className={`text-slate-400 text-lg transition-transform ${openId === d._id ? "rotate-180" : ""}`}>▾</span>
            </div>

            {openId === d._id && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  ["📝 Homework", d.homework],
                  ["📢 Notice",   d.notice],
                  ["💬 Remarks",  d.remarks],
                  ["⭐ Feedback", d.feedback],
                ].filter(([, v]) => v).map(([label, val]) => (
                  <div key={label} className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs font-bold text-slate-500 mb-1">{label}</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{val}</p>
                  </div>
                ))}
                {!d.homework && !d.notice && !d.remarks && !d.feedback && (
                  <p className="text-slate-400 text-xs col-span-2">No details added.</p>
                )}
              </div>
            )}
          </Card>
        ))
      )}
    </PageShell>
  );
}
