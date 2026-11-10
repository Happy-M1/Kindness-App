
// pro-app/src/components/impact/VideoPlayerModal.jsx
import { FaTimes } from "react-icons/fa";

export default function VideoPlayerModal({ activeVideo, onClose }) {
  if (!activeVideo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full p-4 sm:p-5 space-y-4 text-gray-200">
        <div className="flex justify-between items-center border-b border-gray-800 pb-3 gap-2">
          <div className="min-w-0">
            <h4 className="text-[11px] sm:text-sm font-bold text-purple-400 uppercase tracking-wider truncate">
              {activeVideo.stage} Proof
            </h4>
            <h3 className="text-xs sm:text-base font-bold text-white truncate w-full">
              {activeVideo.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-gray-800 transition cursor-pointer shrink-0"
          >
            <FaTimes />
          </button>
        </div>

        <div className="relative aspect-video bg-black rounded-2xl overflow-hidden flex items-center justify-center border border-gray-800 w-full">
          <video
            src={activeVideo.url}
            controls
            autoPlay
            className="w-full h-full object-contain"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
}
