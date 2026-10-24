import { NavLink, Navigate, Outlet } from "react-router-dom";
import { useReadySession } from "@/app/SessionContext";

const links = [
  { to: "/admin/students", label: "Ученики" },
  { to: "/admin/trainings", label: "Тренировки" },
  { to: "/admin/attendance", label: "Посещения" },
];

export function AdminLayout() {
  const { isAdmin } = useReadySession();

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <div className="subnav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => (isActive ? "subnav-link is-active" : "subnav-link")}
          >
            {link.label}
          </NavLink>
        ))}
      </div>
      <Outlet />
    </div>
  );
}
