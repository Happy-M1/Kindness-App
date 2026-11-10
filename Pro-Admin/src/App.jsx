// Pro-Admin/src/App.jsx
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AdminLayout from "./components/layout/AdminLayout.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import ManageUsersPage from "./pages/ManageUsersPage.jsx";
import ManageActsPage from "./pages/ManageActsPage.jsx";
import RippleOversightPage from "./pages/RippleOversightPage.jsx";
import AuditLogsPage from "./pages/AuditLogsPage.jsx";
import AdminLoginPage from "./pages/AdminLoginPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import { AdminGuard } from "./hooks/useAdminGuard.jsx";
import ContactSubmissions from "./pages/admin/ContactSubmissions.jsx";
import SiteContentPage from "./pages/admin/SiteContentPage.jsx";
import TestimonialManager from "./pages/admin/TestimonialManager.jsx";
import AdminProfilePage from "./pages/admin/AdminProfilePage.jsx";
import AdminApprovalsPage from "./pages/admin/AdminApprovalsPage.jsx";
import AdminEcosystemGraphPage from "./pages/admin/AdminEcosystemGraphPage.jsx";
import ManageImpactStories from "./pages/admin/ManageImpactStories.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

function App() {
  return (
    <>
      <Routes>
        {/* Public entry */}
        <Route path="/login" element={<AdminLoginPage />} />

        {/* Root "/" shows a landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* Protected admin routes */}
        <Route
          path="/admin"
          element={
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          }
        >
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="users" element={<ManageUsersPage />} />
          <Route path="acts" element={<ManageActsPage />} />
          <Route path="ripple" element={<RippleOversightPage />} />
          <Route path="logs" element={<AuditLogsPage />} />
          <Route path="contact-submissions" element={<ContactSubmissions />} />
          <Route path="site-content" element={<SiteContentPage />} />
          <Route path="testimonials" element={<TestimonialManager />} />
          <Route path="profile" element={<AdminProfilePage />} />
          <Route path="approvals" element={<AdminApprovalsPage />} />
          <Route path="ecosystem-graph" element={<AdminEcosystemGraphPage />} />
          <Route path="impact-stories" element={<ManageImpactStories />} />
        </Route>

        {/* ✅ Catch-all wildcard MUST be at the bottom */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* Global Toast Container for popups */}
      <ToastContainer position="bottom-right" theme="dark" autoClose={3000} />
    </>
  );
}

export default App;
