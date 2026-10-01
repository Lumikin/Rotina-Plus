import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registrer from "./pages/Registrer";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Tarefas from "./pages/Dashboard";
import { isAuthenticated } from "./services/authService";

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registrer />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Tarefas />
            </ProtectedRoute>
          }
        />
        <Route path="/verificar-email" element={<VerifyEmail />} />
        <Route path="/esqueci-senha" element={<ForgotPassword />} />
        <Route path="/redefinir-senha" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;