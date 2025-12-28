import { Outlet, Link } from "react-router-dom";

export default function ParentLayout() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a1a44] text-white min-h-screen p-6">
        <h2 className="text-xl font-bold mb-6">Parent Panel</h2>
        <nav className="space-y-4">
          <Link to="/parent/payments/make" className="block hover:underline">
            Make Payment
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
