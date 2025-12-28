import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { clearToken } from "../../lib/api";
import logo from "../../assets/logo.png";

import {
  HiOutlineHome,
  HiOutlineBuildingOffice2,
  HiOutlineBanknotes,
  HiOutlineUserGroup,
  HiOutlineUser,
  HiOutlineCreditCard,
  HiOutlineChartBar,
  HiOutlineClipboardDocumentList,
  HiOutlineEnvelope,
  HiOutlineTicket,
  HiOutlineCalendar,
  HiOutlineUserPlus,
  HiOutlineUsers,
  HiOutlineChatBubbleLeftRight,
  HiOutlineArrowsRightLeft,
  HiOutlineBell,
  HiOutlineAcademicCap,
  HiOutlineCurrencyRupee,
  HiChevronDown,
  HiChevronRight,
} from "react-icons/hi2";

/* ===================== MENU ===================== */
const MENU = [
  { key: "dashboard", label: "Dashboard", to: "/admin", icon: <HiOutlineHome /> },
  { key: "school", label: "School Details", to: "/admin/onboarding", icon: <HiOutlineBuildingOffice2 /> },
  { key: "fees", label: "Fees Management", to: "/admin/fees", icon: <HiOutlineBanknotes /> },
  { key: "class", label: "Class", to: "/admin/class", icon: <HiOutlineUserGroup /> },
  { key: "student", label: "Student", to: "/admin/students", icon: <HiOutlineUser /> },

  { key: "attendance", label: "Attendance", to: "/admin/attendance", icon: <HiOutlineClipboardDocumentList /> },

  {
    key: "payment",
    label: "Payment",
    icon: <HiOutlineCreditCard />,
    children: [
      { key: "make-payment", label: "Make Payment", to: "/admin/payments/make" },
      { key: "verify-payment", label: "Verify Payment", to: "/admin/payments/verify" },
    ],
  },

  {
    key: "staff",
    label: "Staff",
    icon: <HiOutlineUserGroup />,
    children: [
      { key: "teachers", label: "Teachers", to: "/admin/staff/teachers", icon: <HiOutlineAcademicCap /> },
      { key: "accountants", label: "Accountants", to: "/admin/staff/accountants", icon: <HiOutlineCurrencyRupee /> },
    ],
  },

  { key: "income", label: "Income", to: "/admin/income", icon: <HiOutlineChartBar /> },
  { key: "expenses", label: "Expenses", to: "/admin/expenses", icon: <HiOutlineClipboardDocumentList /> },
  { key: "announcements", label: "Announcements", to: "/admin/announcements", icon: <HiOutlineEnvelope /> },
  { key: "marksheets", label: "Marksheets", to: "/admin/marksheets", icon: <HiOutlineTicket /> },
  { key: "holidays", label: "Holiday Calendar", to: "/admin/holidays", icon: <HiOutlineCalendar /> },
  { key: "admission", label: "Admission Enquiry", to: "/admin/admissions", icon: <HiOutlineUserPlus /> },
  { key: "visitors", label: "Visitors", to: "/admin/visitors", icon: <HiOutlineUsers /> },
  { key: "complaints", label: "Complaints", to: "/admin/complaints", icon: <HiOutlineChatBubbleLeftRight /> },
  { key: "users", label: "User & Roles", to: "/admin/users", icon: <HiOutlineArrowsRightLeft /> },
];

/* ===================== TOPBAR ===================== */
function Topbar({ schoolName }) {
  const navigate = useNavigate();

  function logout() {
    clearToken();
    navigate("/login", { replace: true });
  }

  return (
    <header className="flex items-center justify-between gap-6 p-3 bg-white border-b">
      <div className="flex items-center gap-5">
        <div className="hidden md:block text-l text-black">Dashboard</div>
        <input
          className="w-full md:w-[380px] rounded-md border px-3 py-2 text-sm bg-slate-50"
          placeholder="Search anything..."
        />
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-md hover:bg-slate-100">
          <HiOutlineBell className="w-5 h-5 text-slate-600" />
          <span className="absolute -top-1 -right-1 text-[10px] bg-rose-500 text-white px-1.5 rounded-full">
            3
          </span>
        </button>

        <div className="flex items-center gap-3">
          <div className="hidden md:block text-right">
            <div className="text-sm font-medium">Pooran</div>
            <div className="text-xs text-slate-400">Senior Admin</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-semibold text-indigo-700">
            P
          </div>
          <button onClick={logout} className="text-sm text-rose-600 px-3 py-1 rounded hover:bg-rose-50">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

/* ===================== SIDEBAR ===================== */
function Sidebar({ collapsed, setCollapsed }) {
  const [openMenu, setOpenMenu] = useState(null);

  return (
    <aside className={`bg-white border-r ${collapsed ? "w-20" : "w-64"} transition-all`}>
      <div className="h-full flex flex-col">
        <div className="p-4 flex justify-between items-center">
          <img src={logo} alt="School Logo" className="h-10 hidden md:block" />
          <button onClick={() => setCollapsed(!collapsed)} className="hidden md:block">
            🡸
          </button>
        </div>

        <nav className="flex-1 overflow-auto px-2 pb-6">
          <ul className="space-y-1">
            {MENU.map((m) => {
              if (m.children) {
                const isOpen = openMenu === m.key;

                return (
                  <li key={m.key}>
                    <button
                      onClick={() => setOpenMenu(isOpen ? null : m.key)}
                      className="flex items-center justify-between w-full px-3 py-2 text-sm rounded hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{m.icon}</span>
                        {!collapsed && <span>{m.label}</span>}
                      </div>
                      {!collapsed && (isOpen ? <HiChevronDown /> : <HiChevronRight />)}
                    </button>

                    {!collapsed && isOpen && (
                      <ul className="ml-8 mt-1 space-y-1">
                        {m.children.map((c) => (
                          <li key={c.key}>
                            <NavLink
                              to={c.to}
                              className={({ isActive }) =>
                                `block px-3 py-2 text-sm rounded hover:bg-slate-50 ${
                                  isActive ? "bg-apple-50 text-apple-700 font-medium" : "text-slate-600"
                                }`
                              }
                            >
                              {c.label}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              }

              return (
                <li key={m.key}>
                  <NavLink
                    to={m.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 text-sm rounded hover:bg-slate-50 ${
                        isActive ? "bg-apple-50 text-apple-700 font-medium" : "text-slate-700"
                      }`
                    }
                  >
                    <span className="text-lg">{m.icon}</span>
                    {!collapsed && <span>{m.label}</span>}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}

/* ===================== LAYOUT ===================== */
export default function AdminLayout({ schoolName }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-cream">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 flex flex-col">
        <Topbar schoolName={schoolName} />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
