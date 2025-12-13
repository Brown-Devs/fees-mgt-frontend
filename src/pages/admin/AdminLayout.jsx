import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { clearToken } from "../../lib/api";
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
  HiOutlineChartPie,
  HiOutlinePlusCircle,
  HiOutlineDocumentText  
} from "react-icons/hi2";

import { FiClipboard, FiUserCheck } from "react-icons/fi";


const MENU = [
  { key: "dashboard",      label: "Dashboard",         to: "/admin",                 icon: <HiOutlineHome /> },
  { key: "school",         label: "School Details",    to: "/admin/onboarding",      icon: <HiOutlineBuildingOffice2 /> },
  { key: "fees",           label: "Fees Management",   to: "/admin/fees",            icon: <HiOutlineBanknotes /> },
  { key: "class",          label: "Class",             to: "/admin/branches",        icon: <HiOutlineUserGroup /> },
  { key: "student",        label: "Student",           to: "/admin/students",        icon: <HiOutlineUser /> },
  { key: "payment",        label: "Payment",           to: "/admin/payment",         icon: <HiOutlineCreditCard /> },
  { key: "income",         label: "Income",            to: "/admin/income",          icon: <HiOutlineChartBar /> },
  { key: "expenses",       label: "Expenses",          to: "/admin/expenses",        icon: <HiOutlineClipboardDocumentList /> },
  { key: "announcements",  label: "Announcements",     to: "/admin/announcements",   icon: <HiOutlineEnvelope /> },
  { key: "marksheets",     label: "Marksheets",        to: "/admin/marksheets",      icon: <HiOutlineTicket /> },
  { key: "holidays",       label: "Holiday Calendar",  to: "/admin/holidays",        icon: <HiOutlineCalendar /> },
  { key: "admission",      label: "Admission Enquiry", to: "/admin/admissions",      icon: <HiOutlineUserPlus /> },
  { key: "visitors",       label: "Visitors",          to: "/admin/visitors",        icon: <HiOutlineUsers /> },
  { key: "complaints",     label: "Complaints",        to: "/admin/complaints",      icon: <HiOutlineChatBubbleLeftRight /> },
  { key: "users",          label: "User & Roles",      to: "/admin/users",           icon: <HiOutlineArrowsRightLeft /> },
];


function Topbar({ schoolName }) {
  const navigate = useNavigate();
  function logout() {
    clearToken();
    navigate("/login", { replace: true });
  }

  return (
    <header className="flex items-center justify-between gap-4 p-3 bg-white border-b">
      <div className="flex items-center gap-3">
        {/* compact logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-apple-50 to-apple-100 flex items-center justify-center text-apple-700 font-bold">S</div>
          <div className="hidden md:block">
            <div className="text-sm font-semibold text-apple-700">{schoolName || "School Admin"}</div>
            <div className="text-xs text-slate-400">Admin Dashboard</div>
          </div>
        </div>

        {/* search */}
        <div className="ml-4">
          <div className="relative">
            <input
              className="w-full md:w-[380px] rounded-md border px-3 py-2 text-sm placeholder:text-slate-400 bg-slate-50"
              placeholder="Search anything..."
              aria-label="Search"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-md hover:bg-slate-100" title="Notifications">
          <HiOutlineBell className="w-5 h-5 text-slate-600" />
          <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-semibold bg-rose-500 text-white rounded-full">3</span>
        </button>

        <button className="p-2 rounded-md hover:bg-slate-100" title="Help">
          <HiOutlineDocumentText className="w-5 h-5 text-slate-600" />
        </button>

        {/* profile */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <div className="text-sm font-medium">Pooran</div>
            <div className="text-xs text-slate-400">Senior Admin</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-pink-100 flex items-center justify-center font-semibold text-indigo-700">P</div>
          <button onClick={logout} className="ml-2 text-sm text-rose-600 px-3 py-1 rounded hover:bg-rose-50">Logout</button>
        </div>
      </div>
    </header>
  );
}

function Sidebar({ collapsed, setCollapsed }) {
  return (
    <aside className={`flex-shrink-0 bg-white border-r ${collapsed ? "w-20" : "w-64"} transition-width duration-200`}>
      <div className="h-full flex flex-col">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`rounded-md ${collapsed ? 'w-8 h-8' : 'w-10 h-10'} bg-apple-50 flex items-center justify-center text-apple-700 font-bold`}>S</div>
            {!collapsed && <div className="text-sm font-semibold text-apple-700">School Admin</div>}
          </div>
          <button onClick={() => setCollapsed(!collapsed)} className="text-slate-400 hover:text-slate-600 hidden md:block">🡸</button>
        </div>

        <nav className="flex-1 overflow-auto px-2 pb-6">
          <div className="text-xs text-slate-400 uppercase px-3 pb-2 hidden md:block">Main</div>
          <ul className="space-y-1">
            {MENU.map((m) => (
              <li key={m.key}>
                <NavLink
                  to={m.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm hover:bg-slate-50 transition ${
                      isActive ? "bg-apple-50 text-apple-700 font-medium" : "text-slate-700"
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

        <div className="p-3 border-t">
          {!collapsed && (
            <div className="text-xs text-slate-500">Tip: Use the menu to navigate</div>
          )}
        </div>
      </div>
    </aside>
  );
}

export default function AdminLayout({ schoolName }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-cream">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 flex flex-col min-h-screen">
        <Topbar schoolName={schoolName} />
        <main className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <div className="text-xs text-slate-400">Enrolled Students</div>
              <div className="mt-2 text-2xl font-bold text-apple-700">1,245</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <div className="text-xs text-slate-400">Active Teachers</div>
              <div className="mt-2 text-2xl font-bold text-slate-700">86</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <div className="text-xs text-slate-400">Pending Fees</div>
              <div className="mt-2 text-2xl font-bold text-rose-600">₹ 42,300</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <div className="text-xs text-slate-400">Branches</div>
              <div className="mt-2 text-2xl font-bold text-slate-700">3</div>
            </div>
          </div>


          <div className="min-h-[56vh]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
