import { useNavigate } from "react-router-dom";

function  Home() {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate("/sobre")}>
      Ir para Sobre
    </button>
  );
}

export default Home;