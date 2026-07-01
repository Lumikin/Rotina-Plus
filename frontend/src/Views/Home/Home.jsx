import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <button onClick={() => navigate("/cadastro")}>Cadastrar</button>
      <button onClick={() => navigate("/login")}>Login</button>
    </>
  );
}

export default Home;
