import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/login";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import Unauthorized from "./pages/Unauthorized";

import SuperadminDashboard from "./pages/Superadmin/Dashboard";

import AdminDashboard from "./pages/admin/Dashboard";
import SchoolOnboarding from "./pages/admin/Onboarding/SchoolOnboarding";
import BranchesList from "./pages/admin/Branches/BranchesList";
import StudentsList from "./pages/admin/Students/StudentsList";
import FeeSetup from "./pages/admin/Fees/FeeSetup";
import UserList from "./pages/admin/Users/UserList";

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* SUPERADMIN */}
      <Route
        path="/superadmin/dashboard"
        element={
          <ProtectedRoute allowRoles={["superadmin"]}>
            <SuperadminDashboard />
          </ProtectedRoute>
        }
      />

      {/* ADMIN PANEL (Layout + nested routes using Outlet) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowRoles={["admin", "superadmin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* Nested admin pages */}
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="onboarding" element={<SchoolOnboarding />} />
        <Route path="branches" element={<BranchesList />} />
        <Route path="students" element={<StudentsList />} />
        <Route path="fees" element={<FeeSetup />} />
        <Route path="users" element={<UserList />} />
      </Route>

      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* PARENT */}
      <Route
        path="/parent/dashboard"
        element={
          <ProtectedRoute allowRoles={["parent"]}>
            <div>Parent Dashboard</div>
          </ProtectedRoute>
        }
      />

      {/* TEACHER */}
      <Route
        path="/teacher/dashboard"
        element={
          <ProtectedRoute allowRoles={["teacher"]}>
            <div>Teacher Dashboard</div>
          </ProtectedRoute>
        }
      />

      {/* ACCOUNTANT */}
      <Route
        path="/accountant/dashboard"
        element={
          <ProtectedRoute allowRoles={["accountant"]}>
            <div>Accountant Dashboard</div>
          </ProtectedRoute>
        }
      />

      {/* Default / Not Found */}
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
}

export default App;
