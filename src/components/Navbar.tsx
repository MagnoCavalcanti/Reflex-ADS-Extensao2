import { NavLink } from "react-router";
import perfilImg from "../img/perfil-de-usuario.png";

const links = [
  { label: "Início", to: "/dashboard", end: true },
  { label: "Conteúdos", to: "/conteudos", end: false },
  { label: "Quizzes", to: "/quizzes", end: false },
  { label: "Sobre", to: "/sobre", end: false },
  { label: "Contato", to: "/contato", end: false },
];

type NavbarProps = {
  showProfile?: boolean;
};

export default function Navbar({ showProfile = true }: NavbarProps) {
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
                  isActive ? "bg-gray-100 text-gray-900" : "text-gray-600",
                ].join(" ")
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {showProfile ? (
          <NavLink to="/perfil" className="shrink-0">
            <img
              src={perfilImg}
              alt="Ir para perfil"
              className="h-14 w-14 rounded-full object-cover ring-2 ring-gray-200"
            />
          </NavLink>
        ) : null}
      </div>
    </header>
  );
}
