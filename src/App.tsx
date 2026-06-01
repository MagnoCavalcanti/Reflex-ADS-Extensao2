import { Navigate, RouterProvider, createBrowserRouter, useParams } from "react-router";
import RedirectIfAuthenticated from "./components/RedirectIfAuthenticated";
import RequireAuth from "./components/RequireAuth";
import RequireRole from "./components/RequireRole";
import IndexPage from "./pages/index";
import CadastroPage from "./pages/CadastroPage";
import DashboardPage from "./pages/DashboardPage.tsx";
import LoginPage from "./pages/LoginPage";
import PerfilRedirect from "./components/PerfilRedirect";
import AulaPlayerPage from "./pages/aluno/AulaPlayerPage";
import ConfiguracoesAlunoPage from "./pages/aluno/ConfiguracoesAlunoPage";
import CatalogoCursosPage from "./pages/aluno/CatalogoCursosPage";
import CursoPage from "./pages/aluno/CursoPage";
import DashboardAlunoPage from "./pages/aluno/DashboardAlunoPage";
import ConfiguracoesProfessorPage from "./pages/professor/ConfiguracoesProfessorPage";
import DashboardProfessorPage from "./pages/professor/DashboardProfessorPage";
import GerenciarCursoPage from "./pages/professor/GerenciarCursoPage";
import MeusCursosPage from "./pages/professor/MeusCursosPage";

function LegacyCourseRedirect() {
  const { courseId } = useParams<{ courseId: string }>();
  return <Navigate to={`/curso/${courseId ?? ""}`} replace />;
}

function ProfessorModulosRedirect() {
  const { courseId } = useParams<{ courseId: string }>();
  return (
    <Navigate to={`/professor/cursos/${courseId ?? ""}?aba=conteudo`} replace />
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <RedirectIfAuthenticated>
        <IndexPage />
      </RedirectIfAuthenticated>
    ),
  },
  {
    path: "/login",
    element: (
      <RedirectIfAuthenticated>
        <LoginPage />
      </RedirectIfAuthenticated>
    ),
  },
  {
    path: "/cadastro",
    element: (
      <RedirectIfAuthenticated>
        <CadastroPage />
      </RedirectIfAuthenticated>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <RequireAuth>
        <DashboardPage />
      </RequireAuth>
    ),
  },
  {
    path: "/aluno/dashboard",
    element: (
      <RequireRole allowedRole="A">
        <DashboardAlunoPage />
      </RequireRole>
    ),
  },
  {
    path: "/aluno/configuracoes",
    element: (
      <RequireRole allowedRole="A">
        <ConfiguracoesAlunoPage />
      </RequireRole>
    ),
  },
  {
    path: "/cursos",
    element: (
      <RequireRole allowedRole="A">
        <CatalogoCursosPage />
      </RequireRole>
    ),
  },
  {
    path: "/curso/:id",
    element: (
      <RequireRole allowedRole="A">
        <CursoPage />
      </RequireRole>
    ),
  },
  {
    path: "/curso/:id/aula/:aulaId",
    element: (
      <RequireRole allowedRole="A">
        <AulaPlayerPage />
      </RequireRole>
    ),
  },
  {
    path: "/professor/dashboard",
    element: (
      <RequireRole allowedRole="P">
        <DashboardProfessorPage />
      </RequireRole>
    ),
  },
  {
    path: "/professor/cursos",
    element: (
      <RequireRole allowedRole="P">
        <MeusCursosPage />
      </RequireRole>
    ),
  },
  {
    path: "/professor/cursos/:courseId/modulos",
    element: <ProfessorModulosRedirect />,
  },
  {
    path: "/professor/cursos/:courseId",
    element: (
      <RequireRole allowedRole="P">
        <GerenciarCursoPage />
      </RequireRole>
    ),
  },
  {
    path: "/professor/configuracoes",
    element: (
      <RequireRole allowedRole="P">
        <ConfiguracoesProfessorPage />
      </RequireRole>
    ),
  },
  {
    path: "/perfil",
    element: (
      <RequireAuth>
        <PerfilRedirect />
      </RequireAuth>
    ),
  },
  { path: "/conteudos", element: <Navigate to="/cursos" replace /> },
  { path: "/conteudos/*", element: <Navigate to="/cursos" replace /> },
  { path: "/quizzes", element: <Navigate to="/aluno/dashboard" replace /> },
  { path: "/quizzes/*", element: <Navigate to="/aluno/dashboard" replace /> },
  {
    path: "/cursos/:courseId",
    element: <LegacyCourseRedirect />,
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
