import { Routes, Route } from "react-router-dom";
import Sobre from "./Views/Login/Sobre";
import Home from "./Views/Home/Home";

// React router dom:
// Cria rotas no frontend, para navegar entre páginas sem precisar recarregar a página inteira

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sobre" element={<Sobre />} />
    </Routes>
  );
}

export default App;
