// src/pages/staff/TeacherDashboard.jsx
import { useEffect, useState } from "react";
import api from "../../apis/axios";
import {
  HiOutlineSpeakerWave,
  HiOutlineClipboardDocumentList,
  HiOutlineBookOpen,
  HiOutlineCalendarDays,
  HiOutlineCheckCircle,
} from "react-icons/hi2";

export default function TeacherDashboard() {
  const [stats, setStats] = useState({
    announcements: 0,
    marksheets: 0,
    diaryEntries: 0,
    holidays: 0,
    attendanceToday: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [annRes, holRes, attRes] = await Promise.allSettled([
        api.get("/api/announcements"),
        api.get("/api/holidays"),
        api.get("/api/teacher-attendance/today"),
      ]);

      setStats({
        announcements: annRes.status === "fulfilled" ? (annRes.value.data.data?.length || 0) : 0,
        holidays: holRes.status === "fulfilled" ? (holRes.value.data.data?.length || 0) : 0,
        attendanceToday: attRes.status === "fulfilled" ? attRes.value.data.data : null,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const attendanceStatus = stats.attendanceToday;

  return (
    <div className="space-y-8">
      {/* Attendance Status Banner */}
      <div className={`rounded-2xl p-5 flex items-center gap-4 border ${
        !attendanceStatus
          ? "bg-amber-50 border-amber-200"
          : attendanceStatus.checkOutTime
          ? "bg-green-50 border-green-200"
          : "bg-blue-50 border-blue-200"
      }`}>
        <HiOutlineCheckCircle className={`text-3xl ${
          !attendanceStatus ? "text-amber-500"
          : attendanceStatus.checkOutTime ? "text-green-600"
          : "text-blue-600"
        }`} />
        <div>
          <p className="font-semibold text-slate-800">
            {!attendanceStatus
              ? "You haven't marked attendance today"
              : attendanceStatus.checkOutTime
              ? `Checked out at ${new Date(attendanceStatus.checkOutTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`
              : `Checked in at ${new Date(attendanceStatus.checkInTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`
            }
          </p>
          <p className="text-sm text-slate-500">
            {!attendanceStatus
              ? "Go to Attendance to mark your check-in"
              : attendanceStatus.checkOutTime
              ? "Attendance complete for today"
              : "Don't forget to check out when you leave"
            }
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Announcements" value={stats.announcements} icon={<HiOutlineSpeakerWave />} />
        <KpiCard title="Marksheets" value="View" icon={<HiOutlineClipboardDocumentList />} />
        <KpiCard title="School Diary" value="View" icon={<HiOutlineBookOpen />} />
        <KpiCard title="Holidays" value={stats.holidays} icon={<HiOutlineCalendarDays />} />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <QuickCard
          title="Today's Attendance"
          desc="Mark your check-in or check-out for today"
          link="attendance"
          color="bg-[#eef2ff]"
          icon={<HiOutlineCheckCircle className="text-[#0a1a44] text-2xl" />}
        />
        <QuickCard
          title="Announcements"
          desc="Stay updated with school announcements"
          link="announcements"
          color="bg-amber-50"
          icon={<HiOutlineSpeakerWave className="text-amber-600 text-2xl" />}
        />
      </div>
    </div>
  );
}

function KpiCard({ title, value, icon }) {
  return (
    <div className="relative bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="absolute top-0 left-0 w-full h-1 bg-[#0a1a44] rounded-t-2xl" />
      <div className="flex items-center gap-4 mt-2">
        <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-[#eef2ff] text-[#0a1a44] text-xl">
          {icon}
        </div>
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="text-2xl font-semibold text-[#0a1a44] mt-1">{value}</p>
        </div>
      </div>
    </div>
  );
}

function QuickCard({ title, desc, link, color, icon }) {
  return (
    <a href={link} className={`${color} rounded-2xl p-6 border border-slate-100 flex items-start gap-4 hover:shadow-md transition`}>
      <div className="mt-1">{icon}</div>
      <div>
        <p className="font-semibold text-slate-800">{title}</p>
        <p className="text-sm text-slate-500 mt-1">{desc}</p>
      </div>
    </a>
  );
}
