// src/pages/staff/StudentAttendancePage.jsx
// Teacher marks attendance for students in their assigned class
import { useEffect, useState } from "react";
import api from "../../apis/axios";
import { HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineClock } from "react-icons/hi2";

const STATUS = { present: "present", absent: "absent", late: "late" };

const STATUS_STYLE = {
  present: "bg-green-100 text-green-700 border-green-300",
  absent:  "bg-red-100  text-red-700  border-red-300",
  late:    "bg-amber-100 text-amber-700 border-amber-300",
};

export default function StudentAttendancePage() {
  const [classes,   setClasses]   = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [students,  setStudents]  = useState([]);
  const [attendance, setAttendance] = useState({}); // { studentId: "present"|"absent"|"late" }
  const [date,      setDate]      = useState(new Date().toISOString().slice(0, 10));
  const [loading,   setLoading]   = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [existing,  setExisting]  = useState(false); // already submitted today

  // Load classes
  useEffect(() => {
    api.get("/api/classes")
      .then(res => {
        const list = res.data.data || res.data || [];
        setClasses(list);
        if (list.length > 0) setSelectedClass(list[0]._id);
      })
      .catch(console.error);
  }, []);

  // Load students + existing attendance when class or date changes
  useEffect(() => {
    if (!selectedClass) return;
    fetchStudents();
  }, [selectedClass, date]);

  const fetchStudents = async () => {
    setLoading(true);
    setAttendance({});
    setExisting(false);
    setSaved(false);
    try {
      // Get students for this class
      const sRes = await api.get("/api/students", { params: { classId: selectedClass } });
      const list = sRes.data.data || sRes.data || [];
      setStudents(list);

      // Default everyone to present
      const defaults = {};
      list.forEach(s => { defaults[s._id] = STATUS.present; });
      setAttendance(defaults);

      // Check if attendance already submitted for this class+date
      try {
        const aRes = await api.get("/api/attendance", {
          params: { classId: selectedClass, date }
        });
        const records = aRes.data.data || aRes.data || [];
        if (records.length > 0) {
          const mapped = {};
          records.forEach(r => { mapped[r.studentId?._id || r.studentId] = r.status; });
          setAttendance(prev => ({ ...prev, ...mapped }));
          setExisting(true);
        }
      } catch {
        // No existing record — that's fine
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const setStatus = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const markAll = (status) => {
    const all = {};
    students.forEach(s => { all[s._id] = status; });
    setAttendance(all);
  };

  const handleSubmit = async () => {
    if (!selectedClass) return alert("Please select a class");
    setSaving(true);
    try {
      const records = students.map(s => ({
        studentId: s._id,
        status: attendance[s._id] || STATUS.absent,
        classId: selectedClass,
        date,
      }));

      await api.post("/api/attendance/bulk", { records, classId: selectedClass, date });
      setSaved(true);
      setExisting(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  const counts = {
    present: Object.values(attendance).filter(v => v === STATUS.present).length,
    absent:  Object.values(attendance).filter(v => v === STATUS.absent).length,
    late:    Object.values(attendance).filter(v => v === STATUS.late).length,
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <h2 className="text-2xl font-bold text-[#0a1a44]">Student Attendance</h2>

      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Class selector */}
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Select Class</label>
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0a1a44]"
            >
              {classes.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Date picker */}
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              max={new Date().toISOString().slice(0, 10)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1a44]"
            />
          </div>

          {/* Quick mark all */}
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Mark All As</label>
            <div className="flex gap-2">
              <button onClick={() => markAll("present")}
                className="flex-1 py-2.5 text-xs rounded-lg bg-green-100 text-green-700 border border-green-300 hover:bg-green-200 transition font-medium">
                All Present
              </button>
              <button onClick={() => markAll("absent")}
                className="flex-1 py-2.5 text-xs rounded-lg bg-red-100 text-red-700 border border-red-300 hover:bg-red-200 transition font-medium">
                All Absent
              </button>
            </div>
          </div>
        </div>

        {/* Already submitted notice */}
        {existing && (
          <div className="mt-4 flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
            <HiOutlineCheckCircle className="text-blue-600 text-lg shrink-0" />
            <p className="text-sm text-blue-700">
              Attendance already submitted for this date. You can update it below.
            </p>
          </div>
        )}
      </div>

      {/* Stats */}
      {students.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Present" value={counts.present} color="text-green-700" bg="bg-green-50 border-green-200" />
          <StatCard label="Absent"  value={counts.absent}  color="text-red-700"   bg="bg-red-50 border-red-200" />
          <StatCard label="Late"    value={counts.late}    color="text-amber-700" bg="bg-amber-50 border-amber-200" />
        </div>
      )}

      {/* Student List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="h-1 bg-[#0a1a44]" />
        <div className="p-5">
          {loading ? (
            <p className="text-sm text-slate-500 py-6 text-center">Loading students...</p>
          ) : students.length === 0 ? (
            <p className="text-sm text-slate-500 py-6 text-center">No students found in this class.</p>
          ) : (
            <div className="space-y-2">
              {students.map((s, idx) => {
                const status = attendance[s._id] || STATUS.absent;
                return (
                  <div
                    key={s._id}
                    className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition"
                  >
                    {/* Student info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs text-slate-400 w-6 shrink-0">{idx + 1}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">
                          {s.fullName || s.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {s.rollNo ? `Roll: ${s.rollNo}` : s.admissionNo ? `Adm: ${s.admissionNo}` : ""}
                        </p>
                      </div>
                    </div>

                    {/* Status buttons */}
                    <div className="flex gap-2 shrink-0">
                      {Object.entries(STATUS).map(([key, val]) => (
                        <button
                          key={key}
                          onClick={() => setStatus(s._id, val)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                            status === val
                              ? STATUS_STYLE[val]
                              : "border-slate-200 text-slate-400 hover:border-slate-300"
                          }`}
                        >
                          {key === "present" ? "P" : key === "absent" ? "A" : "L"}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Submit */}
      {students.length > 0 && (
        <div className="flex items-center gap-4">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-7 py-3 bg-[#0a1a44] text-white rounded-xl font-semibold text-sm hover:bg-[#132b6b] transition disabled:opacity-60"
          >
            {saving ? "Saving..." : existing ? "Update Attendance" : "Submit Attendance"}
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 text-green-700 text-sm font-medium">
              <HiOutlineCheckCircle className="text-lg" /> Saved successfully!
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color, bg }) {
  return (
    <div className={`rounded-xl border p-4 text-center ${bg}`}>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className={`text-xs font-medium mt-1 ${color}`}>{label}</p>
    </div>
  );
}
