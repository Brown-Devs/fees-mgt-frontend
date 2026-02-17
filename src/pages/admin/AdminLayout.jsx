import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { clearToken } from "../../lib/api";
import api from "../../apis/axios";
import logo from "../../assets/logo.png";
import { HiOutlineCog6Tooth } from "react-icons/hi2";


import {
  HiOutlineHome,
  HiOutlineBuildingOffice2,
  HiOutlineBanknotes,
  HiOutlineUserGroup,
  HiOutlineUser,
  HiOutlineChartBar,
  HiOutlineClipboardDocumentList,
  HiOutlineEnvelope,
  HiOutlineTicket,
  HiOutlineCalendar,
  HiOutlineUserPlus,
  HiOutlineUsers,
  HiOutlineChatBubbleLeftRight,
  HiOutlineBookOpen,
} from "react-icons/hi2";

/* ===================== MENU ===================== */
const MENU = [
  { key: "dashboard", label: "Dashboard", to: "/admin", icon: <HiOutlineHome /> },
  { key: "fees", label: "Fees Management", to: "/admin/fees", icon: <HiOutlineBanknotes /> },
  { key: "class", label: "Class", to: "/admin/class", icon: <HiOutlineUserGroup /> },
  { key: "student", label: "Student", to: "/admin/students", icon: <HiOutlineUser /> },
  { key: "attendance", label: "Attendance", to: "/admin/attendance", icon: <HiOutlineClipboardDocumentList /> },
  { key: "income", label: "Income", to: "/admin/income", icon: <HiOutlineChartBar /> },
  { key: "expenses", label: "Expenses", to: "/admin/expenses", icon: <HiOutlineClipboardDocumentList /> },
  { key: "announcements", label: "Announcements", to: "/admin/announcements", icon: <HiOutlineEnvelope /> },
  { key: "marksheets", label: "Marksheets", to: "/admin/marksheets", icon: <HiOutlineTicket /> },
  { key: "holidays", label: "Holiday Calendar", to: "/admin/holidays", icon: <HiOutlineCalendar /> },
  { key: "admission", label: "Admission Enquiry", to: "/admin/admissions", icon: <HiOutlineUserPlus /> },
  { key: "visitors", label: "Visitors", to: "/admin/visitors", icon: <HiOutlineUsers /> },
  { key: "school-diary", label: "School Diary", to: "/admin/school-diary", icon: <HiOutlineBookOpen /> },
  { key: "complaints", label: "Complaints", to: "/admin/complaints", icon: <HiOutlineChatBubbleLeftRight /> },
  { key: "settings", label: "Settings", to: "/admin/onboarding", icon: <HiOutlineCog6Tooth /> },

];

/* ===================== TOPBAR ===================== */
function Topbar() {
  const navigate = useNavigate();
  const [schoolName, setSchoolName] = useState("");

  useEffect(() => {
    const fetchSchool = async () => {
      try {
        const res = await api.get("/api/schools/me");
        setSchoolName(res.data.data?.name || "");
      } catch (err) {
        console.error("Failed to fetch school name");
      }
    };

    fetchSchool();
  }, []);

  const logout = () => {
    clearToken();
    navigate("/login", { replace: true });
  };

  /* Date Format */
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="h-20 flex items-center justify-between px-8 
                       bg-[#0a1a44] border-b border-white/10">

      {/* LEFT SIDE */}
      <h1 className="text-xl font-semibold text-white">
        Welcome,{" "}
        <span className="text-[#c7d2fe]">
          {schoolName || "Loading..."}
        </span>
      </h1>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-6">

        {/* Date Only */}
        <span className="text-sm text-white/80 font-medium">
          {today}
        </span>

        {/* Logout Button with Better Border */}
        <button
          onClick={logout}
          className="text-sm font-medium text-white
                     px-5 py-2 rounded-lg
                     border-2 border-white
                     hover:bg-white hover:text-[#0a1a44]
                     transition-all duration-200"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

/* ===================== SIDEBAR ===================== */
function Sidebar({ collapsed, setCollapsed }) {
  return (
    <aside
      className={`bg-[#0a1a44] text-slate-300 min-h-screen transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}`}
    >
      <div className="bg-white h-20 flex items-center justify-center border-b border-slate-200">
        <img
          src={logo}
          alt="Logo"
          className={`object-contain transition-all duration-300 ${
            collapsed ? "h-8" : "h-10"
          }`}
        />
      </div>

      <nav className="px-3 pt-4">
        <ul className="space-y-1">
          {MENU.map((m) => (
            <li key={m.key}>
              <NavLink
                to={m.to}
                end={m.key === "dashboard"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition
                  ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "hover:bg-white/10"
                  }`
                }
              >
                <span className="text-lg">{m.icon}</span>
                {!collapsed && <span>{m.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

/* ===================== LAYOUT ===================== */
export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#f4f6fb]">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
