import { NavLink, useLocation, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

const links = [
  { label: "Início", to: "/dashboard", end: true },
  { label: "Conteúdos", to: "/conteudos", end: false },
  { label: "Quizzes", to: "/quizzes", end: false },
];

type NavbarProps = {
  showProfile?: boolean;
};

export default function Navbar({ showProfile = true }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/80">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <NavLink to="/dashboard" className="text-xl font-bold text-gray-900">
          Reflex ADS
        </NavLink>

        <nav className="flex max-w-[min(100%,42rem)] flex-1 flex-wrap gap-1 overflow-x-auto sm:justify-center">
          {links.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                [
                  "whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  "hover:bg-gray-100 hover:text-gray-900",
                  isActive || (link.to === "/dashboard" && location.pathname.endsWith("/dashboard"))
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600",
                ].join(" ")
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-medium text-gray-600 sm:inline">
              {user?.type_user === "P" ? "Professor" : "Aluno"}
            </span>

            {showProfile ? (
              <NavLink to="/perfil" className="shrink-0">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">{user?.username?.charAt(0).toUpperCase()}</span>
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
