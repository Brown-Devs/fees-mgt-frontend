import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { clearToken } from "../../lib/api";
import logo from "../../assets/logo.png";
import { HiOutlineCreditCard } from "react-icons/hi2";

export default function AccountantLayout() {
  const navigate = useNavigate();

  const logout = () => {
    clearToken();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-[#0a1a44]">

      {/* Sidebar */}
      <aside className="w-64 bg-[#0a1a44] text-slate-300">
        <div className="h-full flex flex-col">

          {/* WHITE LOGO STRIP */}
          <div className="bg-white h-20 flex flex-col items-center justify-center border-b border-slate-200">
            <img
              src={logo}
              alt="School Logo"
              className="h-10 object-contain"
            />
            <span className="text-xs font-semibold text-slate-600 mt-1">
              Accountant Panel
            </span>
          </div>

          {/* Menu */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            <NavLink
              to="/accountant/payments/verify"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition
                ${isActive
                  ? "bg-white/20 text-white font-medium"
                  : "hover:bg-white/10"
                }`
              }
            >
              <HiOutlineCreditCard className="text-lg" />
              Verify Payment
            </NavLink>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={logout}
              className="w-full text-sm font-medium text-white
                         py-2 rounded-lg
                         hover:bg-white/10 transition"
            >
              Logout
            </button>
          </div>

        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 bg-[#f4f6fb] rounded-tl-3xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
