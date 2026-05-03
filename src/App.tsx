import { Navigate, RouterProvider, createBrowserRouter } from "react-router";
import CadastroPage from "./pages/CadastroPage";
import ContatoPage from "./pages/ContatoPage";
import ConteudosPage from "./pages/ConteudosPage";
import ConteudosLogicaPage from "./pages/ConteudosLogicaPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import PerfilPage from "./pages/PerfilPage";
import QuizConjuntosNumericosPage from "./pages/QuizConjuntosNumericosPage";
import QuizzMatematicaPage from "./pages/QuizzMatematicaPage";
import QuizzesPage from "./pages/QuizzesPage";
import RecuperarSenhaPage from "./pages/RecuperarSenhaPage";
import RedefinirSenhaPage from "./pages/RedefinirSenhaPage";
import SobrePage from "./pages/SobrePage";

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/cadastro", element: <CadastroPage /> },
  { path: "/recuperar-senha", element: <RecuperarSenhaPage /> },
  { path: "/redefinir-senha", element: <RedefinirSenhaPage /> },
  { path: "/dashboard", element: <DashboardPage /> },
  { path: "/perfil", element: <PerfilPage /> },
  { path: "/sobre", element: <SobrePage /> },
  { path: "/contato", element: <ContatoPage /> },
  { path: "/conteudos", element: <ConteudosPage /> },
  { path: "/conteudos/logica-de-programacao", element: <ConteudosLogicaPage /> },
  { path: "/quizzes", element: <QuizzesPage /> },
  { path: "/quizzes/matematica", element: <QuizzMatematicaPage /> },
  {
    path: "/quizzes/matematica/conjuntos-numericos",
    element: <QuizConjuntosNumericosPage />,
  },
  { path: "*", element: <Navigate to="/login" replace /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
