import { Navigate, RouterProvider, createBrowserRouter } from "react-router";
import RedirectIfAuthenticated from "./components/RedirectIfAuthenticated";
import RequireAuth from "./components/RequireAuth";
import RequireRole from "./components/RequireRole";
import IndexPage from "./pages/index";
import CadastroPage from "./pages/CadastroPage";
import ConteudosPage from "./pages/ConteudosPage";
import ConteudosLogicaPage from "./pages/ConteudosLogicaPage";
import DashboardPage from "./pages/DashboardPage.tsx";
import LoginPage from "./pages/LoginPage";
import PerfilPage from "./pages/PerfilPage";
import DashboardAlunoPage from "./pages/aluno/DashboardAlunoPage";
import CursoModulosPage from "./pages/professor/CursoMetricasPage";
import DashboardProfessorPage from "./pages/professor/DashboardProfessorPage";
import GerenciarCursoPage from "./pages/professor/GerenciarCursoPage";
import QuizConjuntosNumericosPage from "./pages/QuizConjuntosNumericosPage";
import QuizzMatematicaPage from "./pages/QuizzMatematicaPage";
import QuizzesPage from "./pages/QuizzesPage";
import CursoDetalhePage from "./pages/CursoDetalhePage";

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
    path: "/professor/dashboard",
    element: (
      <RequireRole allowedRole="P">
        <DashboardProfessorPage />
      </RequireRole>
    ),
  },
  {
    path: "/professor/cursos/:courseId/modulos",
    element: (
      <RequireRole allowedRole="P">
        <CursoModulosPage />
      </RequireRole>
    ),
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
    path: "/cursos/:courseId",
    element: (
      <RequireAuth>
        <CursoDetalhePage />
      </RequireAuth>
    ),
  },
  {
    path: "/perfil",
    element: (
      <RequireAuth>
        <PerfilPage />
      </RequireAuth>
    ),
  },
  {
    path: "/conteudos",
    element: (
      <RequireAuth>
        <ConteudosPage />
      </RequireAuth>
    ),
  },
  { path: "/conteudos/logica-de-programacao", element: <ConteudosLogicaPage /> },
  { path: "/quizzes", element: <QuizzesPage /> },
  { path: "/quizzes/matematica", element: <QuizzMatematicaPage /> },
  {
    path: "/quizzes/matematica/conjuntos-numericos",
    element: <QuizConjuntosNumericosPage />,
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
