// pro-app/src/App.jsx

import { Routes, Route } from "react-router-dom";
import SignupPage from "./pages/SignupPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Navbar from "./components/layout/Navbar.jsx";
import DashboardLayout from "./components/layout/DashboardLayout.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ActsPage from "./pages/ActsPage.jsx";
import AddActPage from "./pages/AddActPage.jsx";

import DashboardTestimonialsPage from "./pages/DashboardTestimonialsPage.jsx";

// new public pages
import HomePage from "./pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import TermsPage from "./pages/TermsPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserEcosystemGraphPage from "./pages/UserEcosystemGraphPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import ImpactStories from "./components/ImpactStories.jsx";
import Unauthorized from "./components/Unauthorized.jsx";
import Footer from "./components/Footer.jsx";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public landing pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/contact" element={<ContactPage />} />

        <Route path="/impact-stories" element={<ImpactStories />} />

        {/* Protected dashboard routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={["user"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="acts" element={<ActsPage />} />
          <Route path="add-act" element={<AddActPage />} />

          <Route path="ecosystem" element={<UserEcosystemGraphPage />} />

          <Route path="testimonials" element={<DashboardTestimonialsPage />} />
        </Route>

        {/* Auth */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
      <Footer />
    </>
  );
}

export default App;
