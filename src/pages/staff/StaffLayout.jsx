import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { clearToken, getPermissions, getUser } from "../../lib/api";
import logo from "../../assets/logo.png";
import { STAFF_NAV } from "../../constants/staffNavConfig";

export default function StaffLayout() {
  const navigate = useNavigate();
  const permissions = getPermissions();
  const user = getUser();

  const visibleNav = STAFF_NAV.filter((item) =>
    permissions.includes(item.permission)
  );

  const logout = () => {
    clearToken();
    navigate("/login", { replace: true });
  };

  const roleLabel = {
    teacher: "Teacher Panel",
    accountant: "Accountant Panel",
  }[user?.role] || "Staff Panel";

  return (
    <div className="min-h-screen flex bg-[#0a1a44]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a1a44] text-slate-300 flex flex-col">
        {/* Logo strip */}
        <div className="bg-white h-20 flex flex-col items-center justify-center border-b border-slate-200 shrink-0">
          <img src={logo} alt="Logo" className="h-10 object-contain" />
          <span className="text-xs font-semibold text-slate-600 mt-1">
            {roleLabel}
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {visibleNav.length === 0 ? (
            <p className="text-xs text-slate-500 px-3 pt-2">
              No modules assigned. Contact your admin.
            </p>
          ) : (
            visibleNav.map(({ label, to, icon: Icon, permission }) => (
              <NavLink
                key={permission}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition
                  ${isActive
                    ? "bg-white/20 text-white font-medium"
                    : "hover:bg-white/10"
                  }`
                }
              >
                <Icon className="text-lg shrink-0" />
                {label}
              </NavLink>
            ))
          )}
        </nav>

        {/* User info + Logout */}
        <div className="p-4 border-t border-white/10 shrink-0">
          {user && (
            <p className="text-xs text-slate-400 mb-2 truncate">
              {user.fullName} · {user.role}
            </p>
          )}
          <button
            onClick={logout}
            className="w-full text-sm font-medium text-white py-2 rounded-lg hover:bg-white/10 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 bg-[#f4f6fb] rounded-tl-3xl overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}