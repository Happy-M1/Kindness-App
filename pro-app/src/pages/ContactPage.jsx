// pro-app/src/pages/ContactPage.jsx
import { useState } from "react";
import HomeNavbar from "../components/HomeNavbar.jsx";

import Background from "../components/Background.jsx";
import api from "../utils/api.js";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    try {
      const res = await api.post("/public/contact", form);
      const payload = res?.data ?? res;
      if (payload?.success) {
        setStatus("✅ Message sent successfully!");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("❌ Failed to send message.");
      }
    } catch (err) {
      console.error("contact submit error:", err);
      setStatus("❌ Error sending message.");
    }
  };

  return (
    <Background>
      <HomeNavbar />
      <div className="max-w-lg mx-auto bg-white py-12 px-4 mt-10 rounded shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Contact Us</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="email"
            placeholder="Your email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border rounded px-3 py-2"
            required
          />
          <textarea
            placeholder="Your message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full border rounded px-3 py-2"
            rows={5}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Send
          </button>
        </form>
        {status && <p className="mt-4 text-center text-sm">{status}</p>}
      </div>
    </Background>
  );
}
