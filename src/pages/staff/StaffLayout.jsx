// src/pages/staff/StaffLayout.jsx
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { clearToken, getPermissions, getUser } from "../../lib/api";
import logo from "../../assets/logoo.png"; 
import { STAFF_NAV } from "../../constants/staffNavConfig";
import { useEffect, useState } from "react";
import api from "../../apis/axios";

function Topbar({ user }) {
  const navigate = useNavigate();
  const [schoolName, setSchoolName] = useState("");
  useEffect(() => {
    api.get("/api/schools/me").then(res => setSchoolName(res.data.data?.name || "")).catch(() => {});
  }, []);
  const logout = () => { clearToken(); navigate("/login", { replace: true }); };
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  return (
    <header className="h-20 flex items-center justify-between px-8 bg-[#0a1a44] border-b border-white/10">
      <h1 className="text-white text-xl">Welcome, <span className="text-[#c7d2fe]">{user?.fullName || schoolName || "..."}</span></h1>
      <div className="flex gap-6 items-center">
        <span className="text-white/80 text-sm">{today}</span>
        <button onClick={logout} className="border-2 border-white text-white px-5 py-2 rounded-lg hover:bg-white hover:text-[#0a1a44] transition">Logout</button>
      </div>
    </header>
  );
}

export default function StaffLayout() {
  const permissions = getPermissions();
  const user = getUser();
  const visibleNav = STAFF_NAV.filter(item => {
    if (!permissions.includes(item.permission)) return false;
    if (item.roles && !item.roles.includes(user?.role)) return false;
    return true;
  });
  return (
    <div className="flex min-h-screen bg-[#f4f6fb]">
      <aside className="w-64 bg-[#0a1a44] text-slate-300 flex flex-col shrink-0">
        <div className="h-20 bg-white flex items-center justify-center px-4 shrink-0">
          <img src={logo} alt="Logo" className="h-full w-full object-contain max-h-16 max-w-[180px]" />
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {visibleNav.length === 0 ? (
            <p className="text-xs text-slate-500 px-3 pt-2">No modules assigned. Contact your admin.</p>
          ) : visibleNav.map(({ label, to, icon: Icon, permission }) => (
            <NavLink key={`${permission}-${to}`} to={to}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${isActive ? "bg-white/20 text-white font-medium" : "hover:bg-white/10"}`}>
              <Icon className="text-lg shrink-0" />{label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10 shrink-0">
          {user && <p className="text-xs text-slate-400 mb-1 truncate">{user.fullName} · <span className="capitalize">{user.role}</span></p>}
        </div>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar user={user} />
        <main className="flex-1 p-6 overflow-y-auto"><Outlet /></main>
      </div>
    </div>
  );
}
