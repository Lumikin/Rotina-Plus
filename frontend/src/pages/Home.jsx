import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import CallToAction from "../components/CallToAction";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <CallToAction />
      <Footer />
    </div>
  );
};