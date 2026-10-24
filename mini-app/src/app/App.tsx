import { Navigate, Route, Routes } from "react-router-dom";
import { useSession } from "@/app/SessionContext";
import { AdminAttendancePage } from "@/pages/admin/AdminAttendancePage";
import { AdminLayout } from "@/pages/admin/AdminLayout";
import { AdminStudentsPage } from "@/pages/admin/AdminStudentsPage";
import { AdminTrainingsPage } from "@/pages/admin/AdminTrainingsPage";
import { AnonymousPage } from "@/pages/AnonymousPage";
import { HistoryPage } from "@/pages/student/HistoryPage";
import { HomePage } from "@/pages/student/HomePage";
import { SchedulePage } from "@/pages/student/SchedulePage";
import { TabBar } from "@/shared/ui/TabBar";

export function App() {
  const session = useSession();

  if (session.status === "loading") {
    return (
      <main className="shell">
        <p className="boot">Загрузка…</p>
      </main>
    );
  }

  if (session.status === "anonymous") {
    return (
      <main className="shell">
        <AnonymousPage />
      </main>
    );
  }

  return (
    <main className="shell">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="students" replace />} />
          <Route path="students" element={<AdminStudentsPage />} />
          <Route path="trainings" element={<AdminTrainingsPage />} />
          <Route path="attendance" element={<AdminAttendancePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <TabBar isAdmin={session.isAdmin} />
    </main>
  );
}
