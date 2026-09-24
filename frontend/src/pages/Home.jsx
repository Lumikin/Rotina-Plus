import { useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import CallToAction from "../components/CallToAction";
import Footer from "../components/Footer";

export default function Home() {
  const [temaEscuro, setTemaEscuro] = useState(false);

  const toggleTema = () => {
    setTemaEscuro(!temaEscuro);
  };

  return (
    <div
      data-bs-theme={temaEscuro ? "dark" : "light"}
      className={temaEscuro ? "bg-dark text-white" : "bg-white text-dark"}
      style={{ minHeight: "100vh", transition: "all 0.3s ease" }}
    >
      <Navbar temaEscuro={temaEscuro} toggleTema={toggleTema} />
      <Hero temaEscuro={temaEscuro} />
      <Features temaEscuro={temaEscuro} />
      <HowItWorks temaEscuro={temaEscuro} />
      <CallToAction temaEscuro={temaEscuro} />
      <Footer temaEscuro={temaEscuro} />
    </div>
  );
}