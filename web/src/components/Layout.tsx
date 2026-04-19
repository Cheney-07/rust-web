import { Link, Outlet } from "react-router-dom";
import { BookOpen, GraduationCap, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-6 h-16">
            <Link to="/" className="font-semibold text-lg">
              教师课程管理系统
            </Link>
            <div className="flex items-center gap-4 ml-auto">
              <NavLink to="/" icon={<Home className="w-4 h-4" />}>
                首页
              </NavLink>
              <NavLink to="/teachers" icon={<GraduationCap className="w-4 h-4" />}>
                教师
              </NavLink>
              <NavLink to="/courses" icon={<BookOpen className="w-4 h-4" />}>
                课程
              </NavLink>
            </div>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

function NavLink({
  to,
  icon,
  children,
}: {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      )}
    >
      {icon}
      {children}
    </Link>
  );
}
