import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { Registrar } from "./pages/Register";
import Tarefas from "./pages/Tarefas";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registrar />} />
        <Route path="/dashbord" element={<Tarefas />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;