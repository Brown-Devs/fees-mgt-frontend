import { Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/login";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminSchool from "./pages/admin/AdminSchool";
import AdminLayout from "./components/admin/AdminLayout";

import SuperadminDashboard from "./pages/Superadmin/Dashboard";

function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route
  path="/admin"
  element={
    <ProtectedRoute allowRoles={["admin", "superadmin"]}>
      <AdminLayout />
    </ProtectedRoute>
  }
></Route>
      <Route path="/login" element={<Login />} />

      {/* Parent */}
      <Route
        path="/parent/dashboard"
        element={
          <ProtectedRoute allowRoles={["parent"]}>
            <div>Parent Dashboard</div>
          </ProtectedRoute>
        }
      />

      {/* Admin */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowRoles={["admin"]}>
            <AdminSchool />
          </ProtectedRoute>
        }
      />

      {/* Teacher */}
      <Route
        path="/teacher/dashboard"
        element={
          <ProtectedRoute allowRoles={["teacher"]}>
            <div>Teacher Dashboard</div>
          </ProtectedRoute>
        }
      />

      {/* Accountant */}
      <Route
        path="/accountant/dashboard"
        element={
          <ProtectedRoute allowRoles={["accountant"]}>
            <div>Accountant Dashboard</div>
          </ProtectedRoute>
        }
      />

      {/* SUPERADMIN — Fully working dashboard */}
      <Route
        path="/superadmin/dashboard"
        element={
          <ProtectedRoute allowRoles={["superadmin"]}>
            <SuperadminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
