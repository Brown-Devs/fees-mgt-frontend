import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/login";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import ParentLayout from "./pages/parent/ParentLayout";
import AccountantLayout from "./pages/accountant/AccountantLayout";
import TeacherLayout from "./pages/teacher/TeacherLayout";

import Unauthorized from "./pages/Unauthorized";
import AttendancePage from "./pages/admin/Attendance/AttendancePage";
import AnnouncementPage from "./pages/admin/Announcement/announcement";
import HolidayCalendar from "./pages/admin/Holiday/HolidayCalendar";
import EnquiryList from "./pages/admin/Enquiries/EnquiryList";
import VisitorList from "./pages/admin/Visitors/VisitorList";
import IncomeList from "./pages/admin/Income/IncomeList";
import ExpenseList from "./pages/admin/Expenses/ExpenseList";



import SuperadminDashboard from "./pages/Superadmin/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import SchoolOnboarding from "./pages/admin/Onboarding/SchoolOnboarding";
import BranchesList from "./pages/admin/Branches/BranchesList";
import FeeSetup from "./pages/admin/Fees/FeeSetup";
import UserList from "./pages/admin/Users/UserList";
import ClassList from "./pages/admin/Class/ClassList";

// STUDENT MODULE
import StudentListPage from "./modules/students/pages/StudentListPage";
import StudentCreatePage from "./modules/students/pages/StudentCreatePage";
import StudentEditPage from "./modules/students/pages/StudentEditPage";
import StudentDetailPage from "./modules/students/pages/StudentDetailPage";

// STAFF MODULE
import TeacherList from "./pages/admin/staff/TeacherList";
import AccountantList from "./pages/admin/staff/AccountantsList";

// PAYMENTS MODULE
import AdminMakePaymentPage from "./pages/admin/Payments/MakePaymentPage";
import VerifyPaymentPage from "./pages/admin/Payments/VerifyPaymentPage";
import ParentMakePaymentPage from "./pages/parent/MakePaymentPage";
import ParentDashboard from "./pages/parent/ParentDashboard";

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
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="onboarding" element={<SchoolOnboarding />} />
        <Route path="class" element={<ClassList />} />
        <Route path="branches" element={<BranchesList />} />
        <Route path="fees" element={<FeeSetup />} />
        <Route path="announcements" element={<AnnouncementPage />} />
        <Route path="holidays" element={<HolidayCalendar />} />
        <Route path="admissions" element={<EnquiryList />} />
        <Route path="visitors" element={<VisitorList />} />
        <Route path="income" element={<IncomeList />} />
        <Route path="expenses" element={<ExpenseList />} />

 
        {/* PAYMENTS */}
        <Route path="payments/make" element={<AdminMakePaymentPage />} />
        <Route path="payments/verify" element={<VerifyPaymentPage />} />

        {/* STAFF */}
        <Route path="staff/teachers" element={<TeacherList />} />
        <Route path="staff/accountants" element={<AccountantList />} />

        {/* ATTENDANCE */}
        <Route path="attendance" element={<AttendancePage />} />

        <Route path="users" element={<UserList />} />

        {/* STUDENTS */}
        <Route path="students" element={<StudentListPage />} />
        <Route path="students/new" element={<StudentCreatePage />} />
        <Route path="students/:studentId/edit" element={<StudentEditPage />} />
        <Route path="students/:studentId" element={<StudentDetailPage />} />
      </Route>

      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* PARENT PANEL */}
      <Route
        path="/parent"
        element={
          <ProtectedRoute allowRoles={["parent"]}>
            <ParentLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<ParentDashboard />} />
        <Route path="payments/make" element={<ParentMakePaymentPage />} />
      </Route>

      {/* TEACHER PANEL */}
      <Route
        path="/teacher"
        element={
          <ProtectedRoute allowRoles={["teacher"]}>
            <TeacherLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AttendancePage />} />
        <Route path="attendance" element={<AttendancePage />} />
      </Route>

      {/* ACCOUNTANT PANEL */}
      <Route
        path="/accountant"
        element={
          <ProtectedRoute allowRoles={["accountant"]}>
            <AccountantLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<VerifyPaymentPage />} />
        <Route path="payments/make" element={<AdminMakePaymentPage />} />
        <Route path="payments/verify" element={<VerifyPaymentPage />} />
      </Route>

      {/* Default */}
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
}

export default App;
