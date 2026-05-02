import { Navigate, RouterProvider, createBrowserRouter } from "react-router";
import CadastroPage from "./pages/CadastroPage";
import ConteudosPage from "./pages/ConteudosPage";
import LoginPage from "./pages/LoginPage";
import QuizConjuntosNumericosPage from "./pages/QuizConjuntosNumericosPage";
import QuizzMatematicaPage from "./pages/QuizzMatematicaPage";
import QuizzesPage from "./pages/QuizzesPage";
import RecuperarSenhaPage from "./pages/RecuperarSenhaPage";
import RedefinirSenhaPage from "./pages/RedefinirSenhaPage";

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/cadastro", element: <CadastroPage /> },
  { path: "/recuperar-senha", element: <RecuperarSenhaPage /> },
  { path: "/redefinir-senha", element: <RedefinirSenhaPage /> },
  { path: "/conteudos", element: <ConteudosPage /> },
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
