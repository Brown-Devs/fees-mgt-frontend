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
  HiOutlineAcademicCap,
  HiOutlineCurrencyRupee,
  HiChevronDown,
  HiChevronRight,
} from "react-icons/hi2";

/* ===================== MENU (UNCHANGED) ===================== */
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
];

/* ===================== TOPBAR ===================== */
function Topbar({ schoolName }) {
  const navigate = useNavigate();

  function logout() {
    clearToken();
    navigate("/login", { replace: true });
  }

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-slate-200">
      <div className="text-sm font-medium text-slate-600">
        {schoolName || "Dashboard"}
      </div>

      <button
        onClick={logout}
        className="text-sm text-rose-600 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition"
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
      className={`bg-white border-r border-slate-200 ${
        collapsed ? "w-20" : "w-64"
      } transition-all duration-300`}
    >
      <div className="h-full flex flex-col">

        {/* Logo */}
        <div className="px-4 py-6 flex flex-col items-center gap-3">
  <img
    src={logo}
    alt="School Logo"
    className={`transition-all ${
      collapsed ? "h-10" : "h-14"
    }`}
  />

  <button
    onClick={() => setCollapsed(!collapsed)}
    className="hidden md:flex text-slate-400 hover:text-slate-600"
  >
    🡸
  </button>
</div>


        {/* Menu */}
        <nav className="flex-1 overflow-auto px-2 pb-6">
          <ul className="space-y-1">
            {MENU.map((m) => {
              if (m.children) {
                const isOpen = openMenu === m.key;

                return (
                  <li key={m.key}>
                    <button
                      onClick={() => setOpenMenu(isOpen ? null : m.key)}
                      className="flex items-center justify-between w-full px-3 py-2.5 text-sm rounded-lg text-slate-700 hover:bg-blue-50 transition"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg text-slate-500">{m.icon}</span>
                        {!collapsed && <span>{m.label}</span>}
                      </div>
                      {!collapsed &&
                        (isOpen ? (
                          <HiChevronDown className="text-slate-400" />
                        ) : (
                          <HiChevronRight className="text-slate-400" />
                        ))}
                    </button>

                    {!collapsed && isOpen && (
                      <ul className="ml-9 mt-1 space-y-1">
                        {m.children.map((c) => (
                          <li key={c.key}>
                            <NavLink
                              to={c.to}
                              className={({ isActive }) =>
                                `block px-3 py-2 text-sm rounded-lg transition ${
                                  isActive
                                    ? "bg-blue-100 text-blue-700 font-medium"
                                    : "text-slate-600 hover:bg-blue-50"
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
  end={m.key === "dashboard"}  
  className={({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition ${
      isActive
        ? "bg-blue-100 text-blue-700 font-medium"
        : "text-slate-700 hover:bg-blue-50"
    }`
  }
>

                    <span className="text-lg text-slate-500">{m.icon}</span>
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
    <div className="min-h-screen flex bg-blue-50">
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
