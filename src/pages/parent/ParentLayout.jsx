// src/pages/parent/ParentLayout.jsx
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { clearToken } from "../../lib/api";
import logo from "../../assets/logo.png";
import {
  HiOutlineHome,
  HiOutlineCreditCard,
  HiOutlineCalendarDays,
  HiOutlineBanknotes,
  HiOutlineSpeakerWave,
  HiOutlineBookOpen,
  HiOutlineChatBubbleLeftRight,
  HiOutlineTrophy,
  HiOutlineSun,
  HiOutlineUser,
} from "react-icons/hi2";

const NAV = [
  { to: "/parent/dashboard",      label: "Dashboard",       Icon: HiOutlineHome },
  { to: "/parent/profile",        label: "Student Profile", Icon: HiOutlineUser },
  { to: "/parent/attendance",     label: "Attendance",      Icon: HiOutlineCalendarDays },
  { to: "/parent/fees",           label: "Fee Details",     Icon: HiOutlineBanknotes },
  { to: "/parent/payments/make",  label: "Make Payment",    Icon: HiOutlineCreditCard },
  { to: "/parent/announcements",  label: "Announcements",   Icon: HiOutlineSpeakerWave },
  { to: "/parent/diary",          label: "School Diary",    Icon: HiOutlineBookOpen },
  { to: "/parent/complaints",     label: "Complaints",      Icon: HiOutlineChatBubbleLeftRight },
  { to: "/parent/marksheet",      label: "Marksheet",       Icon: HiOutlineTrophy },
  { to: "/parent/holidays",       label: "Holiday Calendar",Icon: HiOutlineSun },
];

export default function ParentLayout() {
  const navigate = useNavigate();
  const logout = () => { clearToken(); navigate("/login", { replace: true }); };

  return (
    <div className="min-h-screen flex bg-[#0a1a44]">
      {/* Sidebar */}
      <aside className="w-60 bg-[#0a1a44] text-slate-300 flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="bg-white h-16 flex flex-col items-center justify-center border-b border-slate-200 flex-shrink-0">
          <img src={logo} alt="Logo" className="h-8 object-contain" />
          <span className="text-xs font-semibold text-slate-500 mt-0.5">Parent Portal</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {NAV.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition
                 ${isActive
                   ? "bg-white/20 text-white font-semibold"
                   : "hover:bg-white/10 text-slate-300"}`
              }
            >
              <Icon className="text-base flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={logout}
            className="w-full text-sm font-medium text-white/70 py-2 rounded-lg hover:bg-white/10 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-5 bg-[#f4f6fb] rounded-tl-3xl overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
