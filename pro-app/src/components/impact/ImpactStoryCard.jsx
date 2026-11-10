
// pro-app/src/components/impact/ImpactStoryCard.jsx
import { FaPlay } from "react-icons/fa";

export default function ImpactStoryCard({ story, onWatchVideo }) {
  const { type, createdAt, title, description, proofVideos, user } = story;

  return (
    <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-800 shadow-xl w-full flex flex-col justify-between overflow-hidden hover:border-gray-700 transition">
      <div className="p-4 sm:p-5 space-y-3 w-full">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span
            className={`text-[9px] sm:text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
              type === "request_help"
                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            }`}
          >
            {type === "request_help" ? "Asking for Help" : "Offering Help"}
          </span>
          <span className="text-[10px] sm:text-[11px] text-gray-500">
            {createdAt ? new Date(createdAt).toLocaleDateString() : ""}
          </span>
        </div>

        <h3 className="font-bold text-white text-sm sm:text-base leading-snug wrap-break-word w-full">
          {title}
        </h3>
        <p className="text-gray-400 text-[11px] sm:text-xs line-clamp-3 leading-relaxed wrap-break-word w-full">
          {description}
        </p>

        {/* 3-Stage Proof Preview Grid */}
        <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-gray-800/60 w-full">
          {[
            { stage: "Beginning", url: proofVideos?.beginning },
            { stage: "Progress", url: proofVideos?.progress },
            { stage: "Ending", url: proofVideos?.ending },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-gray-950 p-2 rounded-xl text-center border border-gray-800 flex flex-col justify-between"
            >
              <p className="text-[9px] uppercase font-bold text-gray-500 truncate">
                {item.stage}
              </p>
              {item.url ? (
                <button
                  onClick={() =>
                    onWatchVideo({ url: item.url, title, stage: item.stage })
                  }
                  className="mt-1 px-2 py-1 bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white rounded-lg text-[10px] font-semibold transition flex items-center justify-center gap-1 cursor-pointer w-full"
                >
                  <FaPlay className="text-[8px] shrink-0" /> Watch
                </button>
              ) : (
                <p className="text-[10px] text-gray-600 mt-1">N/A</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Author Footer */}
      <div className="bg-gray-950/80 px-4 sm:px-5 py-3 border-t border-gray-800 flex items-center justify-between w-full overflow-hidden">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={
              user?.imageUrl ||
              user?.avatarUrl ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user?.username || "Member"
              )}`
            }
            alt=""
            className="w-7 h-7 rounded-full object-cover border border-gray-700 shrink-0"
          />
          <span className="text-[11px] sm:text-xs font-medium text-gray-300 truncate">
            {user?.username || "Community Member"}
          </span>
        </div>
      </div>
    </div>
  );
}
