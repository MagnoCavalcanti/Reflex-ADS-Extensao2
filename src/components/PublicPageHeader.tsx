import { Link } from "react-router";

type PublicPageHeaderProps = {
  title: string;
  subtitle?: string;
};

export default function PublicPageHeader({
  title,
  subtitle,
}: PublicPageHeaderProps) {
  return (
    <header className="border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/80">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link to="/" className="text-xl font-bold text-gray-900">
          Reflex ADS
        </Link>
        <nav className="flex gap-4 text-sm font-medium">
          <Link to="/login" className="text-gray-600 hover:text-gray-900">
            Login
          </Link>
          <Link
            to="/cadastro"
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-white hover:bg-indigo-700"
          >
            Cadastro
          </Link>
        </nav>
      </div>
      <div className="bg-linear-to-r from-blue-700 via-indigo-800 to-purple-600 px-6 py-12 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
          {subtitle ? (
            <p className="mt-3 text-lg text-white/90">{subtitle}</p>
          ) : null}
        </div>
      </div>
    </header>
  );
}
