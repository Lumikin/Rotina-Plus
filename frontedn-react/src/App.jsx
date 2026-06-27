import { Routes, Route } from "react-router-dom";
import Home from "./Views/Home/Home";
import Login from "./Views/Auth/Login";
import Cadastro from "./Views/Auth/Register";

// React router dom:
// Cria rotas no frontend, para navegar entre páginas sem precisar recarregar a página inteira

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
