// pro-app/src/components/layout/DashboardLayout.jsx

import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area with top padding to account for fixed navbar */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-0 sm:p-6 pt-14 sm:pt-20 md:pt-24">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
