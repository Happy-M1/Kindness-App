// pro-app/src/components/ImpactStories.jsx
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { toast } from "react-toastify";
import { FaVideo, FaPlus } from "react-icons/fa";
import { getPublicImpactStories } from "../services/impactStoryService.js";
import ImpactStoryCard from "./impact/ImpactStoryCard.jsx";
import VideoPlayerModal from "./impact/VideoPlayerModal.jsx";
import ImpactStoryModal from "./impact/ImpactStoryModal.jsx";

export default function ImpactStories({ previewMode = false }) {
  const { user } = useAuth();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);

  const fetchStories = useCallback(async () => {
    setLoading(true);
    try {
      const list = await getPublicImpactStories({ previewMode, filter });
      setStories(list);
    } catch {
      console.debug("ImpactStories: failed to load");
    } finally {
      setLoading(false);
    }
  }, [filter, previewMode]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStories();
  }, [fetchStories]);

  const handleOpenModal = () => {
    if (!user) {
      toast.info("Please log in to share your story or request help.");
      return;
    }
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-gray-400 text-xs sm:text-sm animate-pulse">
        Loading community impact stories...
      </div>
    );
  }

  return (
    <section className="w-full max-w-6xl mx-auto py-8 sm:py-12 px-2 sm:px-4 space-y-6 sm:space-y-8 mt-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
        <div className="w-full">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight bg-linear-to-r from-amber-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent wrap-break-word">
            Community Impact & Journey Proof
          </h2>
          <p className="text-[11px] sm:text-xs md:text-sm text-gray-400 mt-1 leading-relaxed wrap-break-word">
            Watch real requests, offers, and 3-stage video proof of kindness in
            action.
          </p>
        </div>

        <button
          onClick={handleOpenModal}
          className="w-full sm:w-auto px-5 py-2.5 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-xs sm:text-sm transition shadow-lg cursor-pointer flex items-center justify-center gap-2 shrink-0"
        >
          <FaPlus /> Share Your Journey
        </button>
      </div>

      {/* Filter Tabs */}
      {!previewMode && (
        <div className="flex items-center gap-2 border-b border-gray-800 pb-4 overflow-x-auto w-full">
          {[
            { id: "all", label: "All Stories" },
            { id: "request_help", label: "Asking For Help" },
            { id: "offer_help", label: "Offering Help" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap shrink-0 ${
                filter === tab.id
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-gray-900 text-gray-400 border border-gray-800 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Stories Grid */}
      {stories.length === 0 ? (
        <div className="text-center py-16 px-3 bg-gray-900/65 backdrop-blur-md rounded-2xl border border-dashed border-gray-800 w-full">
          <FaVideo className="text-4xl text-amber-400/60 mx-auto mb-3" />
          <p className="text-gray-400 text-xs sm:text-sm mb-3 wrap-break-word">
            No impact stories published yet.
          </p>
          <button
            onClick={handleOpenModal}
            className="px-4 py-2 bg-purple-600 text-white text-xs font-semibold rounded-xl hover:bg-purple-500 cursor-pointer transition"
          >
            Be the First to Post
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 w-full">
          {stories.map((story) => (
            <ImpactStoryCard
              key={story._id}
              story={story}
              onWatchVideo={(vidData) => setActiveVideo(vidData)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <VideoPlayerModal
        activeVideo={activeVideo}
        onClose={() => setActiveVideo(null)}
      />

      <ImpactStoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchStories}
      />
    </section>
  );
}
