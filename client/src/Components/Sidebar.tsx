import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Car,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  Calendar,
} from "lucide-react";

/** Utility */
function classNames(...c: (string | false | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

/** Accent */
const ACCENT = "#0505CE";

/** Sidebar item */
type NavItem = { icon: React.ReactNode; label: string; path: string };

const sidebar: NavItem[] = [
  { icon: <Home className="h-5 w-5" />, label: "Home", path: "/admin-dashboard" },
  { icon: <Car className="h-5 w-5" />, label: "Driver", path: "/drivers" },
  { icon: <Users className="h-5 w-5" />, label: "Riders", path: "/riders" },
  { icon: <Calendar className="h-5 w-5" />, label: "Reservations", path: "/reservations" },
  { icon: <CreditCard className="h-5 w-5" />, label: "Payments", path: "/payments" },
  { icon: <BarChart3 className="h-5 w-5" />, label: "Report", path: "/reports" },
  { icon: <Car className="h-5 w-5" />, label: "Rides", path: "/rides" },
  { icon: <Users className="h-5 w-5" />, label: "Waitlist", path: "/waitlist" },
  { icon: <Settings className="h-5 w-5" />, label: "Settings", path: "/settings" },

];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <aside className="w-64 min-h-[calc(100vh-56px)] border-r border-gray-200 bg-black/95 p-4 text-white">
      <nav className="mt-4 space-y-3">
        {sidebar.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => handleNavigation(item.path)}
              className={classNames(
                "flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-sm transition",
                isActive
                  ? "bg-[--accent] text-white"
                  : "hover:bg-white/10 text-white/90"
              )}
              style={
                isActive
                  ? ({ ["--accent" as any]: ACCENT } as React.CSSProperties)
                  : undefined
              }
            >
              <span
                className={classNames(
                  "grid place-items-center rounded-md p-1",
                  isActive && "bg-white/10"
                )}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
