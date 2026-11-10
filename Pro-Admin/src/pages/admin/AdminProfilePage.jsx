// Pro-Admin/src/pages/admin/AdminProfilePage.jsx

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaUserShield, FaSave, FaLock } from "react-icons/fa";
import AdminPasswordCard from "./AdminPasswordCard.jsx";
import AvatarUploadSection from "./AvatarUploadSection.jsx";
import { parseUserPayload } from "../../utils/parseUser.js";

import {
  getAdminProfileService,
  uploadAdminAvatarService,
  updateAdminProfileService,
} from "../../services/adminService.js";

//const DEFAULT_AVATAR = "https://res.cloudinary.com/dtyscug88/image/upload/v1737485239/m3a93hxg4oc0ndxhp9fl.jpg";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    imageUrl: "",
    role: "admin",
  });
  const [inputMode, setInputMode] = useState("upload");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function fetchProfile() {
      try {
        const rawData = await getAdminProfileService();
        const parsed = parseUserPayload(rawData);
        if (mounted) {
          setProfile(parsed);
          if (parsed.imageUrl && !parsed.imageUrl.includes("base64")) {
            setInputMode("url");
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        if (mounted) {
          setProfile({
            username: "Admin",
            email: "admin@proadmin.com",
            imageUrl: "",
            role: "admin",
          });
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchProfile();
    return () => {
      mounted = false;
    };
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    const toastId = toast.loading("Uploading image to Cloudinary...");
    try {
      const data = await uploadAdminAvatarService(formData);
      const uploadedUrl = data?.imageUrl;

      if (uploadedUrl) {
        setProfile((prev) => ({ ...prev, imageUrl: uploadedUrl }));

        if (profile.role === "system_admin") {
          window.dispatchEvent(
            new CustomEvent("adminProfileUpdated", {
              detail: { imageUrl: uploadedUrl, username: profile.username },
            }),
          );
        }

        toast.update(toastId, {
          render: "Image uploaded to Cloudinary successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        throw new Error("Invalid upload response");
      }
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      toast.update(toastId, {
        render: "Failed to upload image to Cloudinary",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // eslint-disable-next-line no-unused-vars
      const payload = await updateAdminProfileService({
        username: profile.username,
        email: profile.email,
        imageUrl: profile.imageUrl,
      });

      const isSystemAdmin = profile.role === "system_admin";

      if (isSystemAdmin) {
        window.dispatchEvent(
          new CustomEvent("adminProfileUpdated", {
            detail: { imageUrl: profile.imageUrl, username: profile.username },
          }),
        );
        toast.success("Profile updated successfully!");
      } else {
        toast.info(
          "Profile update submitted! Waiting for System Admin approval.",
        );
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
      toast.error(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-400 font-medium">
        Loading admin profile...
      </div>
    );
  }

  const isSystemAdmin = profile.role === "system_admin";

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-gray-900 via-slate-900 to-indigo-950 p-5 sm:p-6 rounded-2xl shadow-xl border border-gray-800 text-white flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-linear-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent">
            Admin Profile Settings
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Manage your credentials, Cloudinary avatar, and security role.
          </p>
        </div>
        <div className="bg-blue-500/10 p-3 sm:p-4 rounded-2xl text-blue-400 text-2xl hidden sm:block border border-blue-500/20">
          <FaUserShield />
        </div>
      </div>

      {/* Role Notice Banner */}
      <div
        className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-center gap-3 ${
          isSystemAdmin
            ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-300"
            : "bg-amber-950/30 border-amber-500/30 text-amber-300"
        }`}
      >
        <FaLock className="text-lg shrink-0" />
        <div>
          <span className="font-bold">Current Tier:</span>{" "}
          {isSystemAdmin
            ? "System Admin (Instant Updates & Approval Access Enabled)"
            : "Junior Admin (Profile updates require System Admin approval)"}
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-gray-900/60 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-800">
        <form onSubmit={handleSubmit} className="space-y-6">
          <AvatarUploadSection
            profile={profile}
            setProfile={setProfile}
            inputMode={inputMode}
            setInputMode={setInputMode}
            onFileUpload={handleFileUpload}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="admin-username"
                className="block text-xs font-semibold text-gray-300 mb-1.5"
              >
                Username *
              </label>
              <input
                id="admin-username"
                name="username"
                type="text"
                value={profile.username}
                onChange={(e) =>
                  setProfile({ ...profile, username: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-gray-950/80 border border-gray-800 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
            </div>

            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-semibold text-gray-300 mb-1.5"
              >
                Email Address *
              </label>
              <input
                id="admin-email"
                name="email"
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-gray-950/80 border border-gray-800 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-800">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition shadow-lg cursor-pointer"
            >
              <FaSave /> {saving ? "Saving Changes..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>

      <AdminPasswordCard />
    </div>
  );
}
