import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow">
        <div className="text-xl font-bold p-4 border-b">
          Admin Panel
        </div>

        <ul className="p-4 space-y-2">
          <li><a href="/admin/dashboard" className="block p-2 hover:bg-gray-200 rounded">Dashboard</a></li>
          <li><a href="/admin/school" className="block p-2 hover:bg-gray-200 rounded">School Profile</a></li>
          <li><a href="/admin/branches" className="block p-2 hover:bg-gray-200 rounded">Branches</a></li>
          <li><a href="/admin/classes" className="block p-2 hover:bg-gray-200 rounded">Classes</a></li>
          <li><a href="/admin/students" className="block p-2 hover:bg-gray-200 rounded">Students</a></li>
          <li><a href="/admin/fee-heads" className="block p-2 hover:bg-gray-200 rounded">Fee Heads</a></li>
          <li><a href="/admin/fee-rules" className="block p-2 hover:bg-gray-200 rounded">Fee Rules</a></li>
        </ul>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
