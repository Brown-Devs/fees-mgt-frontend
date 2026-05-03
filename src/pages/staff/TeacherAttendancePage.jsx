// src/pages/staff/TeacherAttendancePage.jsx
import { useEffect, useState } from "react";
import api from "../../apis/axios";
import {
  HiOutlineMapPin, HiOutlineCheckCircle, HiOutlineClock,
  HiOutlineXCircle, HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";

const GEOFENCE_RADIUS_M = 100;

function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const toRad = d => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function TeacherAttendancePage() {
  const [school, setSchool] = useState(null);
  const [todayRecord, setTodayRecord] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [gpsStatus, setGpsStatus] = useState("idle"); // idle | getting | ok | denied | unavailable
  const [distanceInfo, setDistanceInfo] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [schoolRes, todayRes, histRes] = await Promise.allSettled([
        api.get("/api/schools/me"),
        api.get("/api/teacher-attendance/today"),
        api.get("/api/teacher-attendance/my"),
      ]);
      if (schoolRes.status === "fulfilled") setSchool(schoolRes.value.data.data);
      if (todayRes.status === "fulfilled") setTodayRecord(todayRes.value.data.data);
      if (histRes.status === "fulfilled") setHistory(histRes.value.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getLocation = () =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) return reject(new Error("GPS not supported"));
      navigator.geolocation.getCurrentPosition(
        pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        err => reject(err),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });

  const handleCheckIn = async () => {
    setError(""); setSuccess(""); setActionLoading(true); setGpsStatus("getting");
    let locationData = null;
    let locationUnavailable = false;

    try {
      const pos = await getLocation();
      setGpsStatus("ok");
      locationData = pos;

      // Check geofence if school has coordinates
      if (school?.coordinates?.lat && school?.coordinates?.lng) {
        const dist = Math.round(haversineDistance(
          pos.lat, pos.lng,
          school.coordinates.lat, school.coordinates.lng
        ));
        setDistanceInfo(dist);

        if (dist > GEOFENCE_RADIUS_M) {
          setError(`You are ${dist}m from school. Must be within ${GEOFENCE_RADIUS_M}m to mark attendance.`);
          setActionLoading(false);
          setGpsStatus("idle");
          return;
        }
      }
    } catch (err) {
      setGpsStatus("unavailable");
      locationUnavailable = true;
      // Allow with flag if GPS fails
    }

    try {
      const res = await api.post("/api/teacher-attendance/checkin", {
        location: locationData,
        locationUnavailable,
      });
      setTodayRecord(res.data.data);
      setSuccess("Checked in successfully!");
      fetchData();
    } catch (err) {
      setError(err?.response?.data?.message || "Check-in failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setError(""); setSuccess(""); setActionLoading(true); setGpsStatus("getting");
    let locationData = null;
    let locationUnavailable = false;

    try {
      const pos = await getLocation();
      setGpsStatus("ok");
      locationData = pos;
    } catch {
      setGpsStatus("unavailable");
      locationUnavailable = true;
    }

    try {
      const res = await api.post("/api/teacher-attendance/checkout", {
        location: locationData,
        locationUnavailable,
      });
      setTodayRecord(res.data.data);
      setSuccess("Checked out successfully!");
      fetchData();
    } catch (err) {
      setError(err?.response?.data?.message || "Check-out failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <p className="p-6 text-gray-500">Loading...</p>;

  const hasCheckedIn = !!todayRecord?.checkInTime;
  const hasCheckedOut = !!todayRecord?.checkOutTime;

  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-2xl font-bold text-[#0a1a44]">My Attendance</h2>

      {/* Today's Status Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="h-1 bg-[#0a1a44]" />
        <div className="p-6">
          <h3 className="font-semibold text-[#0a1a44] mb-4">Today</h3>

          {/* Status row */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <StatusBox
              label="Check In"
              value={todayRecord?.checkInTime
                ? new Date(todayRecord.checkInTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
                : "—"}
              active={hasCheckedIn}
              icon={<HiOutlineCheckCircle />}
            />
            <StatusBox
              label="Check Out"
              value={todayRecord?.checkOutTime
                ? new Date(todayRecord.checkOutTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
                : "—"}
              active={hasCheckedOut}
              icon={<HiOutlineArrowRightOnRectangle />}
            />
          </div>

          {/* Location flags */}
          {todayRecord?.locationUnavailable && (
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">
              ⚠ GPS was unavailable when attendance was marked
            </p>
          )}
          {todayRecord?.checkInLocation?.lat && (
            <a
              href={`https://www.google.com/maps?q=${todayRecord.checkInLocation.lat},${todayRecord.checkInLocation.lng}`}
              target="_blank" rel="noreferrer"
              className="text-xs text-[#0a1a44] underline mb-4 block"
            >
              📍 View check-in location on map
            </a>
          )}

          {/* GPS status */}
          {gpsStatus === "getting" && (
            <p className="text-sm text-blue-600 mb-3">📡 Getting your location...</p>
          )}
          {gpsStatus === "unavailable" && (
            <p className="text-sm text-amber-600 mb-3">⚠ GPS unavailable — attendance marked without location</p>
          )}
          {distanceInfo !== null && gpsStatus === "ok" && (
            <p className="text-sm text-green-600 mb-3">✓ {distanceInfo}m from school — within range</p>
          )}

          {/* Error / Success */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm mb-4">
              {success}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {!hasCheckedIn && (
              <button
                onClick={handleCheckIn}
                disabled={actionLoading}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#0a1a44] text-white rounded-lg text-sm font-medium hover:bg-[#132b6b] transition disabled:opacity-60"
              >
                <HiOutlineCheckCircle />
                {actionLoading ? "Please wait..." : "Check In"}
              </button>
            )}
            {hasCheckedIn && !hasCheckedOut && (
              <button
                onClick={handleCheckOut}
                disabled={actionLoading}
                className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 transition disabled:opacity-60"
              >
                <HiOutlineArrowRightOnRectangle />
                {actionLoading ? "Please wait..." : "Check Out"}
              </button>
            )}
            {hasCheckedOut && (
              <p className="text-sm text-green-700 font-medium flex items-center gap-2">
                <HiOutlineCheckCircle /> Attendance complete for today
              </p>
            )}
          </div>

          {/* Geofence info */}
          {school?.coordinates?.lat ? (
            <p className="text-xs text-slate-400 mt-4 flex items-center gap-1">
              <HiOutlineMapPin /> Must be within {GEOFENCE_RADIUS_M}m of school to mark attendance
            </p>
          ) : (
            <p className="text-xs text-amber-500 mt-4">
              ⚠ School location not configured — geofence check is disabled
            </p>
          )}
        </div>
      </div>

      {/* Attendance History */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="h-1 bg-[#0a1a44]" />
        <div className="p-6">
          <h3 className="font-semibold text-[#0a1a44] mb-4">Attendance History</h3>
          {history.length === 0 ? (
            <p className="text-sm text-slate-500">No attendance records yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-500 border-b">
                    <th className="pb-2 pr-4">Date</th>
                    <th className="pb-2 pr-4">Check In</th>
                    <th className="pb-2 pr-4">Check Out</th>
                    <th className="pb-2 pr-4">Status</th>
                    <th className="pb-2">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {history.slice(0, 30).map((r) => (
                    <tr key={r._id} className="border-b last:border-0">
                      <td className="py-3 pr-4 text-slate-700">
                        {new Date(r.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td className="py-3 pr-4">
                        {r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "—"}
                      </td>
                      <td className="py-3 pr-4">
                        {r.checkOutTime ? new Date(r.checkOutTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "—"}
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          r.status === "present" ? "bg-green-100 text-green-700" :
                          r.status === "late" ? "bg-amber-100 text-amber-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3">
                        {r.locationUnavailable ? (
                          <span className="text-xs text-amber-500">GPS unavailable</span>
                        ) : r.checkInLocation?.lat ? (
                          <a
                            href={`https://www.google.com/maps?q=${r.checkInLocation.lat},${r.checkInLocation.lng}`}
                            target="_blank" rel="noreferrer"
                            className="text-xs text-[#0a1a44] underline"
                          >
                            View
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
      </div>
    </div>
  );
}

function StatusBox({ label, value, active, icon }) {
  return (
    <div className={`rounded-xl border p-4 flex items-center gap-3 ${
      active ? "border-[#0a1a44] bg-[#eef2ff]" : "border-slate-200 bg-slate-50"
    }`}>
      <div className={`text-xl ${active ? "text-[#0a1a44]" : "text-slate-300"}`}>{icon}</div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className={`font-semibold ${active ? "text-[#0a1a44]" : "text-slate-400"}`}>{value}</p>
      </div>
    </div>
  );
}
