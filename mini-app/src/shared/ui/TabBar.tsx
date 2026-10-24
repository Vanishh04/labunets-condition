import { NavLink, useLocation } from "react-router-dom";

type TabBarProps = {
  isAdmin: boolean;
};

const studentTabs = [
  { to: "/", label: "Профиль", end: true },
  { to: "/schedule", label: "Запись", end: false },
  { to: "/history", label: "История", end: false },
];

export function TabBar({ isAdmin }: TabBarProps) {
  const { pathname } = useLocation();
  const tabs = isAdmin
    ? [...studentTabs, { to: "/admin/students", label: "Админ", end: false }]
    : studentTabs;

  return (
    <nav className="tabbar" aria-label="Разделы">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            isActive || (tab.to.startsWith("/admin") && pathname.startsWith("/admin"))
              ? "tab is-active"
              : "tab"
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}
