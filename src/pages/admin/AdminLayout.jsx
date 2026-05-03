// src/pages/admin/AdminLayout.jsx
import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { clearToken } from "../../lib/api";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../apis/axios";
import logo from "../../assets/logoo.png";

import {
  HiOutlineHome,
  HiOutlineBanknotes,
  HiOutlineUserGroup,
  HiOutlineUser,
  HiOutlineChartBar,
  HiOutlineClipboardDocumentList,
  HiOutlineEnvelope,
  HiOutlineTicket,
  HiOutlineCalendar,
  HiOutlineCog6Tooth,
  HiChevronDown,
} from "react-icons/hi2";

/* ===================== MENU ===================== */
const MENU = [
  { key: "dashboard",    label: "Dashboard",        to: "/admin",            icon: <HiOutlineHome /> },
  { key: "fees",         label: "Fees Management",  to: "/admin/fees",       icon: <HiOutlineBanknotes /> },
  { key: "class",        label: "Class",            to: "/admin/class",      icon: <HiOutlineUserGroup /> },
  { key: "branches",     label: "Branches",         to: "/admin/branches",   icon: <HiOutlineUserGroup /> }, // hidden for branch_admin
  { key: "student",      label: "Student",          to: "/admin/students",   icon: <HiOutlineUser /> },
  { key: "attendance",   label: "Attendance",       to: "/admin/attendance", icon: <HiOutlineClipboardDocumentList /> },

  {
    key: "payment",
    label: "Payment",
    icon: <HiOutlineBanknotes />,
    children: [
      { key: "make-payment",   label: "Make Payment",   to: "/admin/payments/make" },
      { key: "verify-payment", label: "Verify Payment", to: "/admin/payments/verify" },
    ],
  },

  {
    key: "staff",
    label: "Staff",
    icon: <HiOutlineUserGroup />,
    children: [
      { key: "teachers",            label: "Teachers",            to: "/admin/staff/teachers" },
      { key: "accountants",         label: "Accountants",         to: "/admin/staff/accountants" },
      { key: "teacher-attendance",  label: "Teacher Attendance",  to: "/admin/staff/teacher-attendance" }, // ← NEW
    ],
  },

  { key: "income",        label: "Income",            to: "/admin/income",        icon: <HiOutlineChartBar /> },
  { key: "expenses",      label: "Expenses",          to: "/admin/expenses",      icon: <HiOutlineClipboardDocumentList /> },
  { key: "announcements", label: "Announcements",     to: "/admin/announcements", icon: <HiOutlineEnvelope /> },
  { key: "admissions",    label: "Admission Enquiry", to: "/admin/admissions",    icon: <HiOutlineClipboardDocumentList /> },
  { key: "visitors",      label: "Visitors",          to: "/admin/visitors",      icon: <HiOutlineUserGroup /> },
  { key: "complaints",    label: "Complaints",        to: "/admin/complaints",    icon: <HiOutlineClipboardDocumentList /> },
  { key: "marksheets",    label: "Marksheets",        to: "/admin/marksheets",    icon: <HiOutlineTicket /> },
  { key: "school-diary",  label: "School Diary",      to: "/admin/diary",         icon: <HiOutlineClipboardDocumentList /> },
  { key: "holidays",      label: "Holiday Calendar",  to: "/admin/holidays",      icon: <HiOutlineCalendar /> },
  { key: "settings",      label: "Settings",          to: "/admin/onboarding",    icon: <HiOutlineCog6Tooth /> },
];

/* ===================== TOPBAR ===================== */
function Topbar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [schoolName, setSchoolName] = useState("");

  useEffect(() => {
    api.get("/api/schools/me")
      .then(res => setSchoolName(res.data.data?.name || ""))
      .catch(() => {});
  }, []);

  const logout = () => {
    clearToken();
    navigate("/login", { replace: true });
  };

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  // branch_admin shows their name; admin shows school name
  const welcomeName = user?.role === "branch_admin"
    ? user.fullName
    : (schoolName || "Loading...");

  return (
    <header className="h-20 flex items-center justify-between px-8 bg-[#0a1a44] border-b border-white/10">
      <h1 className="text-white text-xl">
        Welcome, <span className="text-[#c7d2fe]">{welcomeName}</span>
      </h1>
      <div className="flex gap-6 items-center">
        <span className="text-white/80 text-sm">{today}</span>
        <button
          onClick={logout}
          className="border-2 border-white text-white px-5 py-2 rounded-lg hover:bg-white hover:text-[#0a1a44] transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

/* ===================== SIDEBAR ===================== */
function Sidebar({ collapsed }) {
  const location = useLocation();
  const { user } = useAuth();
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    MENU.forEach(m => {
      if (m.children) {
        const active = m.children.some(child => location.pathname.startsWith(child.to));
        if (active) setOpenMenu(m.key);
      }
    });
  }, [location.pathname]);

  const toggleMenu = key => setOpenMenu(openMenu === key ? null : key);

  // Filter menu based on role
  const visibleMenu = MENU.filter(m => {
    // branch_admin cannot see Branches menu item
    if (m.key === "branches" && user?.role === "branch_admin") return false;
    return true;
  });

  return (
    <aside className={`bg-[#0a1a44] text-white min-h-screen flex flex-col ${collapsed ? "w-20" : "w-64"}`}>
      {/* Logo */}
      <div className="h-20 bg-white flex items-center justify-center px-4 shrink-0">
        <img
          src={logo}
          alt="logo"
          className={`object-contain ${collapsed ? "h-12 w-12" : "h-16 w-full max-w-[180px]"}`}
        />
      </div>

      <nav className="flex-1 p-3 overflow-y-auto">
        {visibleMenu.map(m => {
          const isParentActive =
            m.children && m.children.some(child => location.pathname.startsWith(child.to));

          return (
            <div key={m.key}>
              {m.children ? (
                <>
                  <button
                    onClick={() => toggleMenu(m.key)}
                    className={`w-full flex justify-between items-center px-3 py-2 rounded-lg text-sm transition ${
                      isParentActive ? "bg-white/20" : "hover:bg-white/10"
                    }`}
                  >
                    <div className="flex gap-3 items-center">
                      {m.icon}
                      {!collapsed && m.label}
                    </div>
                    {!collapsed && (
                      <HiChevronDown className={`transition-transform ${openMenu === m.key ? "rotate-180" : ""}`} />
                    )}
                  </button>

                  {openMenu === m.key && !collapsed && (
                    <div className="ml-8 mt-1 space-y-0.5">
                      {m.children.map(child => (
                        <NavLink
                          key={child.key}
                          to={child.to}
                          className={({ isActive }) =>
                            `block py-2 px-3 rounded text-sm transition ${
                              isActive ? "bg-white/20 font-medium" : "hover:bg-white/10"
                            }`
                          }
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <NavLink
                  to={m.to}
                  end={m.to === "/admin"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                      isActive ? "bg-white/20 font-medium" : "hover:bg-white/10"
                    }`
                  }
                >
                  {m.icon}
                  {!collapsed && m.label}
                </NavLink>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

/* ===================== LAYOUT ===================== */
export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-[#f4f6fb]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
