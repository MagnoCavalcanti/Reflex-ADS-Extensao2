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
import DashboardProfessorPage from "./pages/professor/DashboardProfessorPage";
import QuizConjuntosNumericosPage from "./pages/QuizConjuntosNumericosPage";
import QuizzMatematicaPage from "./pages/QuizzMatematicaPage";
import QuizzesPage from "./pages/QuizzesPage";

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
  { path: "/perfil", element: <PerfilPage /> },
  { path: "/conteudos", element: <ConteudosPage /> },
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
