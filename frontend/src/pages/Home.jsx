import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import CallToAction from "../components/CallToAction";
import Footer from "../components/Footer";
import { useTheme } from "../contexts/ThemeContext";

export default function Home() {
  const { temaEscuro } = useTheme();

  return (
    <div
      data-bs-theme={temaEscuro ? "dark" : "light"}
      className={temaEscuro ? "bg-dark text-white" : "bg-white text-dark"}
      style={{ minHeight: "100vh", transition: "all 0.3s ease" }}
    >
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <CallToAction />
      <Footer />
    </div>
  );
}
