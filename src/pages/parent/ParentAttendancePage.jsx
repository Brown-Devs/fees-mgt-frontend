// src/pages/parent/ParentAttendancePage.jsx
import React, { useEffect, useState, useCallback } from "react";
import api from "../../apis/axios";
import { useStudentByParent } from "./hooks/useStudentByParent";
import { PageShell, Card, CardTitle, StatCard, Spinner, ErrorBox } from "./components/ui";

const MONTHS = ["January","February","March","April","May","June",
                "July","August","September","October","November","December"];
const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

// Build list of last 6 months including current
function buildMonthList() {
  const list = [];
  const now  = new Date();
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    list.push({ year: d.getFullYear(), month: d.getMonth() + 1 });
  }
  return list;
}

export default function ParentAttendancePage() {
  const { student, loading: sLoad, error: sErr } = useStudentByParent();

  const months = buildMonthList();
  const [selected, setSelected] = useState(months[0]);  // current month
  const [records,  setRecords]  = useState([]);
  const [attLoad,  setAttLoad]  = useState(false);
  const [attErr,   setAttErr]   = useState(null);

  const fetchAttendance = useCallback(async (s, { year, month }) => {
    if (!s) return;
    setAttLoad(true);
    setAttErr(null);
    try {
      const from = new Date(year, month - 1, 1).toISOString().split("T")[0];
      const to   = new Date(year, month, 0).toISOString().split("T")[0];
      // Using the existing GET /api/attendance with filters
      const res  = await api.get("/api/attendance", {
        params: {
          classId:   s.classId?._id,
          section:   s.section,
          stream:    s.stream,
          date:      undefined,   // not filtering by single date
          from,
          to,
          studentId: s._id,
        },
      });
      setRecords(res.data.data || []);
    } catch (err) {
      setAttErr(err?.response?.data?.message || "Failed to load attendance");
    } finally {
      setAttLoad(false);
    }
  }, []);

  useEffect(() => {
    if (student) fetchAttendance(student, selected);
  }, [student, selected, fetchAttendance]);

  if (sLoad) return <Spinner />;
  if (sErr)  return <ErrorBox message={sErr} />;

  // Build quick-lookup map: "YYYY-MM-DD" → status
  const recordMap = {};
  records.forEach(r => {
    const d = new Date(r.date).toISOString().split("T")[0];
    recordMap[d] = r.status;
  });

  const presentCount = records.filter(r => r.status === "Present").length;
  const absentCount  = records.filter(r => r.status === "Absent").length;
  const totalMarked  = records.length;
  const attPct       = totalMarked ? Math.round((presentCount / totalMarked) * 100) : 0;

  // Calendar cells
  const { year, month } = selected;
  const firstDay     = new Date(year, month - 1, 1).getDay();
  const daysInMonth  = new Date(year, month, 0).getDate();
  const cells        = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <PageShell title="Attendance" subtitle="Month-wise attendance of your ward">
      {/* Month selector */}
      <Card>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-semibold text-slate-500 mr-1">Select Month:</span>
          {months.map(m => {
            const active = m.year === selected.year && m.month === selected.month;
            return (
              <button
                key={`${m.year}-${m.month}`}
                onClick={() => setSelected(m)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition
                  ${active
                    ? "bg-[#0a1a44] text-white border-[#0a1a44]"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"}`}
              >
                {MONTHS[m.month - 1].slice(0, 3)} {m.year}
              </button>
            );
          })}
        </div>
      </Card>

      {attLoad ? <Spinner /> : attErr ? <ErrorBox message={attErr} /> : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard label="Present"   value={presentCount} colorClass="text-green-600" />
            <StatCard label="Absent"    value={absentCount}  colorClass="text-red-600" />
            <StatCard label="Total Days" value={totalMarked} colorClass="text-[#0a1a44]" />
            <StatCard label="Rate" value={`${attPct}%`} colorClass={attPct >= 75 ? "text-green-600" : "text-red-600"} />
          </div>

          {/* Progress bar */}
          <Card>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-[#0a1a44]">Attendance Rate</span>
              <span className={`text-lg font-bold ${attPct >= 75 ? "text-green-600" : "text-red-600"}`}>{attPct}%</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${attPct >= 75 ? "bg-green-500" : "bg-red-500"}`}
                style={{ width: `${attPct}%` }}
              />
            </div>
            {attPct < 75 && (
              <p className="text-xs text-red-500 mt-2">
                ⚠️ Attendance below 75% may affect exam eligibility.
              </p>
            )}
          </Card>

          {/* Calendar */}
          <Card>
            <CardTitle>{MONTHS[month - 1]} {year} — Calendar</CardTitle>
            {totalMarked === 0 ? (
              <p className="text-slate-400 text-sm text-center py-6">No attendance records found for this month.</p>
            ) : (
              <>
                <div className="grid grid-cols-7 gap-1 mb-1">
                  {DAYS.map(d => (
                    <div key={d} className="text-center text-xs font-bold text-slate-400 py-1">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {cells.map((day, i) => {
                    if (!day) return <div key={`e${i}`} />;
                    const ds     = `${year}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
                    const status = recordMap[ds];
                    return (
                      <div
                        key={day}
                        title={status || "No record"}
                        className={`text-center py-2 rounded-lg text-xs font-semibold border
                          ${status === "Present"
                            ? "bg-green-50 text-green-600 border-green-200"
                            : status === "Absent"
                            ? "bg-red-50 text-red-600 border-red-200"
                            : "bg-slate-50 text-slate-300 border-slate-100"}`}
                      >
                        {day}
                        {status === "Present" && <div className="text-[8px] leading-none">✓</div>}
                        {status === "Absent"  && <div className="text-[8px] leading-none">✗</div>}
                      </div>
                    );
                  })}
                </div>
                {/* Legend */}
                <div className="flex gap-4 mt-4 flex-wrap">
                  {[
                    ["Present",   "bg-green-50 border-green-200 text-green-600"],
                    ["Absent",    "bg-red-50 border-red-200 text-red-600"],
                    ["No Record", "bg-slate-50 border-slate-100 text-slate-300"],
                  ].map(([label, cls]) => (
                    <div key={label} className="flex items-center gap-2 text-xs text-slate-500">
                      <div className={`w-4 h-4 rounded border ${cls}`} />
                      {label}
                    </div>
                  ))}
                </div>
              </>
            )}
          </Card>
        </>
      )}
    </PageShell>
  );
}
