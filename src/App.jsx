import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/login";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import ParentLayout from "./pages/parent/ParentLayout";
import Unauthorized from "./pages/Unauthorized";
import AttendancePage from "./pages/admin/Attendance/AttendancePage";

import SuperadminDashboard from "./pages/Superadmin/Dashboard";

import AdminDashboard from "./pages/admin/Dashboard";
import SchoolOnboarding from "./pages/admin/Onboarding/SchoolOnboarding";
import BranchesList from "./pages/admin/Branches/BranchesList";
import FeeSetup from "./pages/admin/Fees/FeeSetup";
import UserList from "./pages/admin/Users/UserList";
import ClassList from "./pages/admin/Class/ClassList";

// NEW STUDENT MODULE (correct paths)
import StudentListPage from "./modules/students/pages/StudentListPage";
import StudentCreatePage from "./modules/students/pages/StudentCreatePage";
import StudentEditPage from "./modules/students/pages/StudentEditPage";
import StudentDetailPage from "./modules/students/pages/StudentDetailPage";
// STAFF MODULE
import TeacherList from "./pages/admin/staff/TeacherList";
import AccountantList from "./pages/admin/staff/AccountantsList";

import MakePaymentPage from "./pages/admin/Payments/MakePaymentPage";
import VerifyPaymentPage from "./pages/admin/Payments/VerifyPaymentPage";


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

      {/* ADMIN PANEL */}
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
        <Route path="class" element={<ClassList />} />
        <Route path="branches" element={<BranchesList />} />
        <Route path="fees" element={<FeeSetup />} />
        {/* PAYMENT MODULE ROUTES */}
<Route path="payments/make" element={<MakePaymentPage />} />
<Route path="payments/verify" element={<VerifyPaymentPage />} />

        
        {/* STAFF MODULE ROUTES */}
        <Route path="staff/teachers" element={<TeacherList />} />
        <Route path="staff/accountants" element={<AccountantList />} />
          <Route path="attendance" element={<AttendancePage />} />

        <Route path="users" element={<UserList />} />

        {/* STUDENT MODULE ROUTES */}
        <Route path="students" element={<StudentListPage />} />
        <Route path="students/new" element={<StudentCreatePage />} />
        <Route path="students/:studentId/edit" element={<StudentEditPage />} />
        <Route path="students/:studentId" element={<StudentDetailPage />} />
      </Route>

      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* PARENT */}
      <Route path="/parent" element={ <ProtectedRoute allowRoles={["parent"]}>
      <ParentLayout />
    </ProtectedRoute>
  }
>
  <Route path="dashboard" element={<MakePaymentPage />} />
  <Route path="payments/make" element={<MakePaymentPage />} />
</Route>

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

      {/* Default */}
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
}

export default App;
