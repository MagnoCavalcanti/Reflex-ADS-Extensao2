import { NavLink } from "react-router";

const links = [
  { label: "Início", to: "/login" },
  { label: "Conteúdos", to: "/conteudos" },
  { label: "Quizzes", to: "/quizzes" },
  { label: "Sobre", to: "#" },
  { label: "Contato", to: "#" },
];

export default function Navbar() {
  return (
    <header className="border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/80">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <NavLink to="/login" className="text-xl font-bold text-gray-900">
          Reflex ADS
        </NavLink>

        <nav className="flex items-center gap-2">
          {links.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                [
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  "hover:bg-gray-100 hover:text-gray-900",
                  isActive ? "bg-gray-100 text-gray-900" : "text-gray-600",
                ].join(" ")
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
