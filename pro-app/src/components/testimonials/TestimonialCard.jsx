// pro-app/src/components/testimonials/TestimonialCard.jsx
import { FaQuoteLeft } from "react-icons/fa";

export default function TestimonialCard({ testimonial }) {
  const { quote, avatarUrl, name, createdAt } = testimonial;

  return (
    <blockquote className="bg-gray-900/80 backdrop-blur-md p-4 rounded-2xl border border-gray-800 shadow-xl w-full flex flex-col justify-between space-y-3 overflow-hidden">
      <div className="w-full space-y-2">
        <FaQuoteLeft className="text-amber-400/60 text-base" />
        <p className="text-gray-300 text-[11px] sm:text-xs italic leading-relaxed wrap-break-word w-full">
          “{quote}”
        </p>
      </div>

      <div className="flex items-center gap-2.5 pt-3 border-t border-gray-800/60 w-full overflow-hidden">
        <img
          src={
            avatarUrl ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}`
          }
          alt={`${name} avatar`}
          className="w-8 h-8 rounded-full object-cover border border-gray-700 shrink-0"
        />
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-white text-[11px] sm:text-xs truncate">
            {name}
          </div>
          <div className="text-[10px] text-gray-500 truncate">
            {createdAt ? new Date(createdAt).toLocaleDateString() : ""}
          </div>
        </div>
      </div>
    </blockquote>
  );
}
