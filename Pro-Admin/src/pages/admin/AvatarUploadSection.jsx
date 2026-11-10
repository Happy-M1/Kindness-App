// Pro-Admin/src/pages/admin/AvatarUploadSection.jsx

import { FaUpload, FaLink } from "react-icons/fa";

const DEFAULT_AVATAR = "https://res.cloudinary.com/dtyscug88/image/upload/v1737485239/m3a93hxg4oc0ndxhp9fl.jpg";

export default function AvatarUploadSection({ profile, setProfile, inputMode, setInputMode, onFileUpload }) {
  const previewSrc = profile.imageUrl || DEFAULT_AVATAR;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-800">
      <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-blue-400/60 shadow-[0_0_15px_rgba(59,130,246,0.3)] bg-gray-950 shrink-0">
        <img
          src={previewSrc}
          alt="Profile Preview"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="space-y-3 w-full">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-gray-300">
            Profile Avatar (Cloudinary Storage)
          </label>
          <div className="flex bg-gray-950 p-1 rounded-xl border border-gray-800 text-xs font-medium">
            <button
              type="button"
              onClick={() => setInputMode("upload")}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                inputMode === "upload" ? "bg-blue-600 text-white shadow-sm" : "text-gray-400 hover:text-white"
              }`}
            >
              <FaUpload /> Upload to Cloud
            </button>
            <button
              type="button"
              onClick={() => setInputMode("url")}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                inputMode === "url" ? "bg-blue-600 text-white shadow-sm" : "text-gray-400 hover:text-white"
              }`}
            >
              <FaLink /> Image URL
            </button>
          </div>
        </div>

        {inputMode === "upload" ? (
          <div className="flex items-center gap-3">
            <label className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-950 hover:bg-gray-900 text-blue-400 border border-dashed border-blue-500/40 rounded-xl text-xs font-semibold cursor-pointer transition shadow-sm">
              <FaUpload /> Click to upload image to Cloudinary
              <input
                type="file"
                accept="image/*"
                onChange={onFileUpload}
                className="hidden"
              />
            </label>
            {profile.imageUrl && (
              <button
                type="button"
                onClick={() => setProfile((prev) => ({ ...prev, imageUrl: "" }))}
                className="px-3 py-2.5 bg-red-600/15 hover:bg-red-600/25 text-red-400 border border-red-500/30 rounded-xl text-xs font-semibold transition shrink-0"
              >
                Clear
              </button>
            )}
          </div>
        ) : (
          <div>
            <input
              type="url"
              value={profile.imageUrl}
              onChange={(e) => setProfile((prev) => ({ ...prev, imageUrl: e.target.value }))}
              placeholder="https://res.cloudinary.com/..."
              className="w-full px-4 py-2.5 bg-gray-950/80 border border-gray-800 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        )}
        <p className="text-[11px] text-gray-500">
          Images uploaded here are stored securely in Cloudinary.
        </p>
      </div>
    </div>
  );
}

