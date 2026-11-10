// pro-app/src/pages/HomePage.jsx
import HomeNavbar from "../components/HomeNavbar.jsx";

import Background from "../components/Background.jsx";
import HeroSection from "../components/HeroSection.jsx";
import HowItWorks from "../components/HowItWorks.jsx";
import Testimonials from "../components/Testimonials.jsx";

export default function HomePage() {
  return (
    <Background>
      {/* Navbar */}
      <HomeNavbar />

      <main
        className="min-h-screen flex flex-col items-center text-center px-6 relative"
        data-testid="home-page"
      >
        {/* Hero Section */}
        <section className="w-full mb-12" data-testid="hero-section">
          <HeroSection />
        </section>

        {/* How It Works Section */}
        <section className="w-full mb-12" data-testid="how-it-works">
          <HowItWorks />
        </section>

        {/* Testimonials Section */}
        <section className="w-full mb-12" data-testid="testimonials">
          <Testimonials />
        </section>
      </main>

    </Background>
  );
}
