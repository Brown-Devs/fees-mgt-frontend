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
  HiOutlineAcademicCap,
  HiOutlineCurrencyRupee,
  HiChevronDown,
  HiOutlineBookOpen,
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
  { key: "school-diary", label: "School Diary", to: "/admin/school-diary", icon: <HiOutlineBookOpen /> },
  { key: "complaints", label: "Complaints", to: "/admin/complaints", icon: <HiOutlineChatBubbleLeftRight /> },
];

/* ===================== TOPBAR (UPDATED) ===================== */
function Topbar() {
  const navigate = useNavigate();

  const logout = () => {
    clearToken();
    navigate("/login", { replace: true });
  };

  return (
    <header className="h-20 flex items-center justify-between px-8 
                       bg-[#0a1a44] border-b border-white/10">
      {/* Left */}
      <h1 className="text-lg font-semibold text-white">
        Dashboard
      </h1>

      {/* Right */}
      <button
        onClick={logout}
        className="text-sm font-medium text-white
                   px-4 py-2 rounded-lg
                   hover:bg-white/10
                   transition"
      >
        Logout
      </button>
    </header>
  );
}

/* ===================== SIDEBAR ===================== */
function Sidebar({ collapsed, setCollapsed }) {
  const [openMenu, setOpenMenu] = useState(null);

  return (
    <aside
      className={`bg-[#0a1a44] text-slate-300 min-h-screen transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}`}
    >
      {/* WHITE LOGO STRIP */}
      <div className="bg-white h-20 flex flex-col items-center justify-center border-b border-slate-200 relative">
        <img
          src={logo}
          alt="Logo"
          className={`object-contain transition-all duration-300 ${collapsed ? "h-8" : "h-10"
            }`}
        />

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute bottom-1 text-[10px] text-slate-400 hover:text-slate-600 hidden md:block"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      {/* MENU */}
      <nav className="px-3 pt-4">
        <ul className="space-y-1">
          {MENU.map((m) => {
            if (m.children) {
              const isOpen = openMenu === m.key;

              return (
                <li key={m.key}>
                  <button
                    onClick={() => setOpenMenu(isOpen ? null : m.key)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg
                               hover:bg-white/10 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{m.icon}</span>
                      {!collapsed && <span>{m.label}</span>}
                    </div>
                    {!collapsed &&
                      (isOpen ? <HiChevronDown /> : <HiChevronRight />)}
                  </button>

                  {!collapsed && isOpen && (
                    <ul className="ml-9 mt-1 space-y-1">
                      {m.children.map((c) => (
                        <li key={c.key}>
                          <NavLink
                            to={c.to}
                            className={({ isActive }) =>
                              `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition
                              ${isActive
                                ? "bg-white/20 text-white"
                                : "hover:bg-white/10"
                              }`
                            }
                          >
                            {c.icon && <span>{c.icon}</span>}
                            <span>{c.label}</span>
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
                  end={m.key === "dashboard"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition
                    ${isActive
                      ? "bg-white/20 text-white"
                      : "hover:bg-white/10"
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
