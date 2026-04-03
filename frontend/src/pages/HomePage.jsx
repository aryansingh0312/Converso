import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";
import CtaBanner from "../components/CtaBanner";
import Footer from "../components/Footer";

export default function HomePage({ onGetStarted }) {
  return (
    <div className="min-h-screen bg-[#09090f]">
      <Navbar onGetStarted={onGetStarted} />
      <Hero onGetStarted={onGetStarted} />

      {/* Divider */}
      <div className="max-w-[1180px] mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-[rgba(99,102,241,0.3)] to-transparent" />
      </div>

      <Features />

      <div className="max-w-[1180px] mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-[rgba(99,102,241,0.3)] to-transparent" />
      </div>

      <HowItWorks />

      <div className="max-w-[1180px] mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-[rgba(99,102,241,0.3)] to-transparent" />
      </div>

      <Testimonials />

      <CtaBanner onGetStarted={onGetStarted} />

      <Footer />
    </div>
  );
}
