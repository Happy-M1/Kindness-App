// Pro-Admin/src/pages/admin/SiteContentPage.jsx
import { useEffect, useState } from "react";
import api from "../../utils/api.js";
import { toast } from "react-toastify";
import SiteContentCard from "../../components/SiteContentCard.jsx";
import { FaFileCode, FaTimes } from "react-icons/fa";

export default function SiteContentPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // { key, value }
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const fetchContent = async () => {
      setLoading(true);
      try {
        const res = await api.get("/admin/site-content");
        const payload = res?.data ?? res;
        const list = payload?.items ?? [];
        if (mounted) setItems(list);
      } catch (err) {
        console.error("fetch site content error:", err);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load content",
        );
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchContent();
    return () => {
      mounted = false;
    };
  }, []);

  const openEditor = (item) => {
    setEditing({ key: item.key, value: JSON.stringify(item.value, null, 2) });
    setError("");
  };

  const closeEditor = () => setEditing(null);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setError("");
    try {
      let parsed;
      try {
        parsed = JSON.parse(editing.value);
      } catch (parseErr) {
        setError("Invalid JSON. Please correct the value before saving.");
        console.error("JSON parse error:", parseErr);
        setSaving(false);
        return;
      }

      const res = await api.put(
        `/admin/site-content/${encodeURIComponent(editing.key)}`,
        { value: parsed },
      );
      const payload = res?.data ?? res;
      const updated = payload?.item ?? null;

      setItems((prev) =>
        prev.map((it) =>
          it.key === editing.key
            ? updated || { key: editing.key, value: parsed }
            : it,
        ),
      );
      closeEditor();
      toast.success("Site content saved successfully");
    } catch (err) {
      console.error("save content error:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save content",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-400 font-medium">
        Loading site content dataset...
      </div>
    );
  }

  if (error && items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-rose-400 text-sm font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 pb-12 p-4 sm:p-6">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-gray-900 via-slate-900 to-indigo-950 p-5 sm:p-6 rounded-2xl shadow-xl border border-gray-800 text-white flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-linear-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent">
            Site Content Configuration
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Manage dynamic platform configurations and JSON content keys.
          </p>
        </div>
        <div className="bg-indigo-500/10 p-3 sm:p-4 rounded-2xl text-indigo-400 text-2xl hidden sm:block border border-indigo-500/20 shadow-inner">
          <FaFileCode />
        </div>
      </div>

      {/* Content Keys List */}
      <div className="space-y-4">
        {items.map((it) => (
          <SiteContentCard key={it.key} item={it} onEdit={openEditor} />
        ))}
        {items.length === 0 && (
          <div className="text-center py-16 text-gray-400 text-sm bg-gray-900/60 backdrop-blur-md rounded-2xl border border-gray-800 shadow-xl">
            <FaFileCode className="text-3xl mx-auto mb-2 text-gray-600" />
            No content keys found.
          </div>
        )}
      </div>

      {/* Dark-Mode Editor Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl w-full max-w-3xl p-5 sm:p-6 space-y-5 text-gray-200">
            <div className="flex justify-between items-center border-b border-gray-800 pb-3">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Edit Key:{" "}
                <span className="font-mono text-purple-400">{editing.key}</span>
              </h2>
              <button
                onClick={closeEditor}
                className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-gray-800 transition cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label
                  htmlFor="site-content-json"
                  className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5"
                >
                  Value (JSON format) *
                </label>
                <textarea
                  id="site-content-json"
                  name="siteContentJson"
                  value={editing.value}
                  onChange={(e) =>
                    setEditing({ ...editing, value: e.target.value })
                  }
                  rows={14}
                  className="w-full bg-gray-950 text-cyan-300 border border-gray-700 rounded-2xl p-4 text-xs font-mono outline-none focus:border-purple-500 transition shadow-inner leading-relaxed"
                />
              </div>

              {error && (
                <div className="text-rose-400 text-xs sm:text-sm font-medium bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-800">
                <button
                  type="button"
                  onClick={closeEditor}
                  className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm font-semibold text-gray-300 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-purple-900/30 cursor-pointer"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
