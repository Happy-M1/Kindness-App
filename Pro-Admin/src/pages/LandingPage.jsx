// Pro-Admin/src/pages/LandingPage.jsx
export default function LandingPage() {
  return (
    <div className=" bg-amber-900 flex flex-col items-center justify-center min-h-[80vh] text-center px-6 ">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-gray-200/80 shadow-xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Welcome to Pro-Admin
          </h1>
          <p className="text-gray-500 text-sm">
            Manage users, acts, ripples, and site content. Please log in to
            continue.
          </p>
        </div>

        <div>
          <a
            href="/login"
            className="inline-flex items-center justify-center w-full px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-600/10 transition cursor-pointer"
          >
            Admin Login
          </a>
        </div>
      </div>
    </div>
  );
}
