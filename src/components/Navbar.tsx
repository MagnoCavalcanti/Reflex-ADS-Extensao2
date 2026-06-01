import { NavLink, useLocation, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

const studentLinks = [
  { label: "Início", to: "/dashboard", end: true },
  { label: "Conteúdos", to: "/conteudos", end: false },
  { label: "Quizzes", to: "/quizzes", end: false },
] as const;

const navLinkClass =
  "whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900";

function linkClass(active: boolean): string {
  return [navLinkClass, active ? "bg-gray-100 text-gray-900" : "text-gray-600"].join(" ");
}

type NavbarProps = {
  showProfile?: boolean;
};

export default function Navbar({ showProfile = true }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  const isProfessor = user?.type_user === "P";
  const homePath = isProfessor ? "/professor/dashboard" : "/dashboard";
  const displayName =
    user?.username != null && user.username.length > 0
      ? user.username.charAt(0).toUpperCase() + user.username.slice(1)
      : "Dashboard";

  const isProfessorDashboardActive =
    location.pathname === "/professor/dashboard" && location.hash !== "#seus-cursos";

  const isProfessorCoursesActive =
    location.pathname.startsWith("/professor/cursos") ||
    (location.pathname === "/professor/dashboard" && location.hash === "#seus-cursos");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/80">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <NavLink to={homePath} className="text-xl font-bold text-gray-900">
          Reflex ADS
        </NavLink>

        <nav className="flex max-w-[min(100%,42rem)] flex-1 flex-wrap gap-1 overflow-x-auto sm:justify-center">
          {isProfessor ? (
            <>
              <NavLink
                to="/professor/dashboard"
                end
                className={() => linkClass(isProfessorDashboardActive)}
              >
                {displayName}
              </NavLink>
              <NavLink
                to="/professor/dashboard#seus-cursos"
                className={() => linkClass(isProfessorCoursesActive)}
              >
                Meus cursos
              </NavLink>
            </>
          ) : (
            studentLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  linkClass(
                    isActive ||
                      (link.to === "/dashboard" && location.pathname.endsWith("/dashboard")),
                  )
                }
              >
                {link.label}
              </NavLink>
            ))
          )}
        </nav>

        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            {!isProfessor ? (
              <span className="hidden text-sm font-medium text-gray-600 sm:inline">Aluno</span>
            ) : null}

            {showProfile ? (
              <NavLink
                to="/perfil"
                className={({ isActive }) =>
                  [
                    "shrink-0 rounded-full ring-2 ring-transparent transition-shadow",
                    isActive ? "ring-emerald-500" : "hover:ring-gray-200",
                  ].join(" ")
                }
                title="Perfil"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-r from-emerald-600 to-teal-600">
                  <span className="text-xl font-bold text-white">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </NavLink>
            ) : null}

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Sair
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
