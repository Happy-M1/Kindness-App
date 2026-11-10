// pro-app/src/pages/ProfilePage.jsx

import { useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import api from "../utils/api.js";

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    image: null,
  });
  const [preview, setPreview] = useState(
    user?.imageUrl || user?.profileUrl || null,
  );
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("username", formData.username);
      data.append("email", formData.email);
      if (formData.image) data.append("image", formData.image);

      const res = await api.put("/users/profile", data);

      // Expect server to return updated user object at res.data.data.user
      const updatedUser = res.data?.data?.user;
      if (updatedUser) {
        // update auth context so navbar/coin see the new avatar immediately
        setUser((prev) => ({ ...prev, ...updatedUser }));
        setPreview(updatedUser.imageUrl || updatedUser.profileUrl || null);
      }

      setMessage("Profile updated successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error updating profile");
      console.error("Profile update error:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white/20 shadow rounded mt-24">
      <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="border p-2 w-full"
          placeholder="Username"
        />
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 w-full"
          placeholder="Email"
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {preview && (
          <img
            src={preview}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover mt-2"
          />
        )}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </form>
      {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}
    </div>
  );
};

export default ProfilePage;
