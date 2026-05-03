// src/pages/parent/ParentDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../apis/axios";
import { HeroCard, Card, CardTitle, StatCard, Spinner, ErrorBox } from "./components/ui";

export default function ParentDashboard() {
  const navigate = useNavigate();
  const [student,       setStudent]       = useState(null);
  const [fee,           setFee]           = useState(null);
  const [attendance,    setAttendance]    = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        // 1. Student linked to this parent
        const sRes = await api.get("/api/students/by-parent");
        const s = sRes.data.data;
        setStudent(s);

        // 2. Fee summary
        const fRes = await api.get(`/api/fees/student/${s._id}`);
        setFee(fRes.data.data);

        // 3. Attendance (current month summary)
        const today = new Date();
        const from  = new Date(today.getFullYear(), today.getMonth(), 1)
                        .toISOString().split("T")[0];
        const to    = today.toISOString().split("T")[0];
        const aRes  = await api.get("/api/attendance", {
          params: {
            classId: s.classId?._id,
            section: s.section,
            stream:  s.stream,
            from,
            to,
            studentId: s._id,
          },
        });
        setAttendance(aRes.data.data || []);

        // 4. Announcements (most recent 3)
        const annRes = await api.get("/api/announcements");
        setAnnouncements((annRes.data.data || []).slice(0, 3));
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Spinner />;
  if (error)   return <ErrorBox message={error} />;

  // Attendance numbers
  const presentDays = attendance.filter(r => r.status === "Present").length;
  const absentDays  = attendance.filter(r => r.status === "Absent").length;
  const totalDays   = attendance.length;
  const attPct      = totalDays ? Math.round((presentDays / totalDays) * 100) : 0;

  return (
    <div className="space-y-5">
      <HeroCard student={student} />

      {/* Outstanding alert */}
      {fee?.outstanding > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div className="flex-1">
            <p className="font-semibold text-amber-800 text-sm">Outstanding Fee: ₹{fee.outstanding.toLocaleString()}</p>
            <p className="text-amber-600 text-xs mt-0.5">Please pay at the earliest to avoid disruptions.</p>
          </div>
          <button
            onClick={() => navigate("/parent/payments/make")}
            className="text-xs font-semibold px-3 py-1.5 bg-amber-800 text-white rounded-lg hover:bg-amber-900 transition"
          >
            Pay Now
          </button>
        </div>
      )}

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total Fee"    value={`₹${(fee?.totalFee || 0).toLocaleString()}`}   colorClass="text-[#0a1a44]" />
        <StatCard label="Paid"         value={`₹${(fee?.paid || 0).toLocaleString()}`}        colorClass="text-green-600" />
        <StatCard label="Outstanding"  value={`₹${(fee?.outstanding || 0).toLocaleString()}`} colorClass="text-red-600" />
        <StatCard
          label="This Month Attendance"
          value={`${attPct}%`}
          sub={`${presentDays}P / ${absentDays}A / ${totalDays} days`}
          colorClass={attPct >= 75 ? "text-green-600" : "text-red-600"}
        />
      </div>

      {/* Announcements preview */}
      {announcements.length > 0 && (
        <Card>
          <CardTitle>📢 Recent Announcements</CardTitle>
          <div className="divide-y divide-slate-50">
            {announcements.map(a => (
              <div key={a._id} className="py-3">
                <p className="font-semibold text-[#0a1a44] text-sm">{a.title}</p>
                <p className="text-slate-500 text-xs mt-0.5 line-clamp-2">{a.content}</p>
                <p className="text-slate-400 text-xs mt-1">
                  {a.date ? new Date(a.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : ""}
                </p>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate("/parent/announcements")}
            className="mt-3 text-xs font-semibold text-[#0a1a44] underline"
          >
            View all →
          </button>
        </Card>
      )}
    </div>
  );
}
