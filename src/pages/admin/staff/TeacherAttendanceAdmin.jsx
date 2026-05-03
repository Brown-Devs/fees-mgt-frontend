// src/pages/admin/Staff/TeacherAttendanceAdmin.jsx
import { useEffect, useState } from "react";
import api from "../../../apis/axios";

export default function TeacherAttendanceAdmin() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    fetchRecords();
  }, [date]);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/teacher-attendance/admin", { params: { date } });
      setRecords(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#0a1a44]">Teacher Attendance</h2>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1a44]"
        />
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : records.length === 0 ? (
        <p className="text-gray-500 text-sm">No attendance records for this date.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#0a1a44] text-white">
                <th className="p-3 text-left">Teacher</th>
                <th className="p-3 text-left">Check In</th>
                <th className="p-3 text-left">Check Out</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Distance</th>
                <th className="p-3 text-left">Location</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, idx) => (
                <tr key={r._id} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="p-3">
                    <div className="font-medium">{r.teacherId?.fullName || "—"}</div>
                    <div className="text-xs text-slate-400">{r.teacherId?.email}</div>
                  </td>
                  <td className="p-3">
                    {r.checkInTime
                      ? new Date(r.checkInTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
                      : "—"}
                  </td>
                  <td className="p-3">
                    {r.checkOutTime
                      ? new Date(r.checkOutTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
                      : "—"}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      r.status === "present" ? "bg-green-100 text-green-700" :
                      r.status === "late"    ? "bg-amber-100 text-amber-700" :
                                              "bg-red-100 text-red-700"
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {r.distanceFromSchool != null ? `${r.distanceFromSchool}m` : "—"}
                  </td>
                  <td className="p-3">
                    {r.locationUnavailable ? (
                      <span className="text-xs text-amber-500">GPS unavailable</span>
                    ) : r.checkInLocation?.lat ? (
                      <a
                        href={`https://www.google.com/maps?q=${r.checkInLocation.lat},${r.checkInLocation.lng}`}
                        target="_blank" rel="noreferrer"
                        className="text-xs text-[#0a1a44] underline"
                      >
                        View on map
                      </a>
                    ) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
