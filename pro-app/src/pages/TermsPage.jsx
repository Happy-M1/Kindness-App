// pro-app/src/pages/TermsPage.jsx
import HomeNavbar from "../components/HomeNavbar.jsx";
import Background from "../components/Background.jsx";

export default function TermsPage() {
  return (
    <Background>
      <HomeNavbar />
      <div className="max-w-3xl mx-auto py-12 px-4">
        <h1 className=" text-yellow-500 text-3xl font-bold mb-4 text-center">Terms & Conditions</h1>
        <p className="text-white mb-4">
          By using Pay It Forward, you agree to act with honesty, respect, and kindness. Contributions made through the platform are voluntary and intended to help others.
        </p>
        <p className="text-white mb-4">
          We reserve the right to moderate content and remove any activity that violates our community guidelines.
        </p>
        <p className="text-white">
          For full details, please review our official terms document or contact our support team.
        </p>
      </div>
    </Background>
  );
}
