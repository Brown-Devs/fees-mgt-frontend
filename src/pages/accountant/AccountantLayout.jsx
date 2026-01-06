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
    <div className="min-h-screen flex bg-blue-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200">
        <div className="h-full flex flex-col">

          {/* Logo */}
          <div className="px-4 py-6 flex flex-col items-center gap-4 border-b">
            <img src={logo} alt="School Logo" className="h-14" />
            <span className="text-sm font-semibold text-slate-600">
              Accountant Panel
            </span>
          </div>

          {/* Menu */}
          <nav className="flex-1 px-3 py-4">
            <NavLink
              to="/accountant/payments/verify"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  isActive
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "text-slate-700 hover:bg-blue-50"
                }`
              }
            >
              <HiOutlineCreditCard className="text-lg" />
              Verify Payment
            </NavLink>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t">
            <button
              onClick={logout}
              className="w-full text-sm text-rose-600 py-2 rounded-lg hover:bg-rose-50 transition"
            >
              Logout
            </button>
          </div>

        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
