// pro-app/src/pages/AddActPage.jsx
import { useState } from "react";
import api from "../utils/api.js";
import { toast } from "react-toastify";
import DonationForm from "../components/Donation/DonationForm.jsx";
import { FaHandHoldingHeart } from "react-icons/fa";

export default function AddAct() {
  const [formData, setFormData] = useState({
    actDescription: "",
    actType: "",
    place: "",
    receiverEmail: "",
    receiverName: "",
    value: "",
    media: "",
  });

  const [inviteCode, setInviteCode] = useState(null);
  const [acceptCode, setAcceptCode] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ✅ Create Invite (pending act + ripples)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/invites", {
        actDescription: formData.actDescription,
        actType: formData.actType,
        place: formData.place,
        receiverEmail: formData.receiverEmail,
        value: formData.value,
        media: formData.media,
      });

      // ✅ res is already response.data
      if (res.invite && res.invite.code) {
        toast.success("Invite created successfully!");
        setInviteCode(res.invite.code);
        setFormData({
          actDescription: "",
          actType: "",
          place: "",
          receiverEmail: "",
          receiverName: "",
          value: "",
          media: "",
        });
      } else {
        toast.error("Failed to create invite");
      }
    } catch (err) {
      console.error("Error creating invite:", err);
      toast.error(err.message || "Error creating invite");
    }
  };

  // ✅ Copy handler
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied invite code: ${code}`);
  };

  // ✅ Accept Invite (updates act + ripples to confirmed)
  const handleAcceptInvite = async () => {
    try {
      const res = await api.post("/invites/accept", {
        code: acceptCode,
        receiverEmail: formData.receiverEmail,
      });

      // ✅ Check success or message from unwrapped response
      if (res) {
        toast.success("Invite accepted, act + ripple confirmed!");
        setAcceptCode("");
      } else {
        toast.error("Failed to accept invite");
      }
    } catch (err) {
      console.error("Error accepting invite:", err);
      toast.error(err.message || "Error accepting invite");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 pt-8 bg-transparent rounded-lg shadow-lg space-y-6">
      {/* Header */}
      <h2 className="text-xl font-bold flex items-center text-pink-400">
        <FaHandHoldingHeart className="mr-2" /> Add Kindness Act
      </h2>

      {/* Act Type Selector */}
      <select
        id="actType"
        name="actType"
        value={formData.actType}
        onChange={handleChange}
        className="w-full px-3 py-2 rounded-lg bg-transparent border border-pink-400/50 text-gray-200
                   focus:outline-none focus:ring-2 focus:ring-pink-400"
        required
      >
        <option value="">Select Act Type</option>
        <option value="donation">Donation</option>
        <option value="mentorship">Mentorship</option>
        <option value="volunteering">Volunteering</option>
        <option value="gift">Gift</option>
      </select>

      {/* Conditional rendering: Donation vs Other Acts */}
      {formData.actType === "donation" ? (
        <DonationForm />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            id="actDescription"
            name="actDescription"
            value={formData.actDescription}
            onChange={handleChange}
            placeholder="Describe your act of kindness"
            className="w-full px-3 py-2 rounded-lg bg-transparent border border-pink-400/50 text-gray-200
                       focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-gray-500"
            required
          />

          <input
            id="place"
            name="place"
            value={formData.place}
            onChange={handleChange}
            placeholder="Place / Context"
            className="w-full px-3 py-2 rounded-lg bg-transparent border border-cyan-400/50 text-gray-200
                       focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-500"
          />

          <input
            id="receiverEmail"
            name="receiverEmail"
            type="email"
            value={formData.receiverEmail}
            onChange={handleChange}
            placeholder="Receiver Email"
            className="w-full px-3 py-2 rounded-lg bg-transparent border border-blue-400/50 text-gray-200
                       focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-500"
            required
          />

          <input
            id="receiverName"
            name="receiverName"
            value={formData.receiverName}
            onChange={handleChange}
            placeholder="Receiver Name (optional)"
            className="w-full px-3 py-2 rounded-lg bg-transparent border border-green-400/50 text-gray-200
                       focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-500"
          />

          <input
            id="value"
            name="value"
            type="number"
            value={formData.value}
            onChange={handleChange}
            placeholder="Value (hours, amount, etc.)"
            className="w-full px-3 py-2 rounded-lg bg-transparent border border-yellow-400/50 text-gray-200
                       focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-500"
          />

          <input
            id="media"
            name="media"
            type="url"
            value={formData.media}
            onChange={handleChange}
            placeholder="Media Link (optional)"
            className="w-full px-3 py-2 rounded-lg bg-transparent border border-purple-400/50 text-gray-200
                       focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-500"
          />

          <button
            type="submit"
            className="w-full px-4 py-2 rounded-md font-semibold text-white
                       bg-linear-to-r from-pink-500 to-yellow-400
                       hover:from-pink-600 hover:to-yellow-500 transition"
          >
            Create Invite
          </button>
        </form>
      )}

      {/* ✅ Show invite code with Copy button */}
      {inviteCode && (
        <div className="mt-4 p-4 bg-gray-800 text-white rounded-lg shadow space-y-2 border border-green-500/30">
          <p className="font-semibold text-sm text-gray-300">
            Invite Code Generated:
          </p>
          <div className="flex items-center justify-between">
            <span className="text-lg text-green-400 font-mono font-bold">
              {inviteCode}
            </span>
            <button
              type="button"
              onClick={() => handleCopyCode(inviteCode)}
              className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs px-3 py-1.5 rounded transition font-medium"
            >
              Copy Code
            </button>
          </div>
          <p className="text-xs text-gray-400">
            Share this code with the receiver so they can redeem the act.
          </p>
        </div>
      )}

      {/* Accept Invite Section */}
      <div className="mt-6 space-y-4">
        <input
          type="text"
          placeholder="Enter Invite Code"
          value={acceptCode}
          onChange={(e) => setAcceptCode(e.target.value)}
          className="px-3 py-2 w-full rounded border border-purple-400/50 text-gray-200 bg-transparent
                     focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-500"
        />
        <button
          onClick={handleAcceptInvite}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded transition"
        >
          Accept Invite
        </button>
      </div>
    </div>
  );
}
