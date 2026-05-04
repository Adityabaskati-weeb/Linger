import { AnimatePresence } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ProtectedRoute } from "./components/shared/ProtectedRoute";
import { AdminLayout } from "./layouts/AdminLayout";
import { FacultyLayout } from "./layouts/FacultyLayout";
import { StudentLayout } from "./layouts/StudentLayout";
import { Login } from "./pages/auth/Login";
import { AdminAttendanceAnalytics } from "./pages/admin/AttendanceAnalytics";
import { AdminDashboard } from "./pages/admin/Dashboard";
import { AdminDepartments } from "./pages/admin/Departments";
import { AdminFacultyManagement } from "./pages/admin/FacultyManagement";
import { AdminStudents } from "./pages/admin/Students";
import { AdminTimetable } from "./pages/admin/Timetable";
import { FacultyAttendance } from "./pages/faculty/Attendance";
import { FacultyDashboard } from "./pages/faculty/Dashboard";
import { FacultyLeave } from "./pages/faculty/Leave";
import { FacultyMaterials } from "./pages/faculty/Materials";
import { FacultySchedule } from "./pages/faculty/Schedule";
import { StudentAttendance } from "./pages/student/Attendance";
import { StudentAiAgent } from "./pages/student/AiAgent";
import { StudentDashboard } from "./pages/student/Dashboard";
import { StudentSchedule } from "./pages/student/Schedule";

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRole="STUDENT">
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/student/dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="attendance" element={<StudentAttendance />} />
          <Route path="schedule" element={<StudentSchedule />} />
          <Route path="ai-agent" element={<StudentAiAgent />} />
        </Route>

        <Route
          path="/faculty"
          element={
            <ProtectedRoute allowedRole="FACULTY">
              <FacultyLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/faculty/dashboard" replace />} />
          <Route path="dashboard" element={<FacultyDashboard />} />
          <Route path="attendance" element={<FacultyAttendance />} />
          <Route path="schedule" element={<FacultySchedule />} />
          <Route path="leave" element={<FacultyLeave />} />
          <Route path="materials" element={<FacultyMaterials />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="attendance" element={<AdminAttendanceAnalytics />} />
          <Route path="faculty" element={<AdminFacultyManagement />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="timetable" element={<AdminTimetable />} />
          <Route path="departments" element={<AdminDepartments />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
