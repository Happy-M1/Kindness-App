// pro-app/src/pages/AboutPage.jsx
import HomeNavbar from "../components/HomeNavbar.jsx";

import Background from "../components/Background.jsx";

export default function AboutPage() {
  return (
    <Background>
      <HomeNavbar />
      <div className="max-w-3xl mx-auto py-12 px-4 text-center">
        <h1 className=" text-yellow-500 text-3xl font-bold mb-4">About Pay It Forward</h1>
        <p className="text-white mb-6">
          Pay It Forward is a community-driven platform where small acts of
          kindness ripple outward to create big impact. Our mission is to
          connect people who want to help with those who need it most.
        </p>
        <p className="text-white">
          Whether you pledge your time, donate resources, or simply share
          stories, you are part of a movement that inspires generosity and
          compassion.
        </p>
      </div>
      
    </Background>
  );
}
