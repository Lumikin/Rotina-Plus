import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registrer from "./pages/Registrer";
import VerifyCode from "./pages/VerifyCode";
import Tarefas from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registrer />} />
        <Route path="/dashboard" element={<Tarefas />} />
        <Route path="/verify-code" element={<VerifyCode />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
