// Pro-Admin/src/components/TestimonialCard.jsx
export default function TestimonialCard({ testimonial, onApprove, onDelete }) {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 min-w-37.5 transition hover:shadow-md">
      <div className="flex items-start gap-3.5 overflow-hidden flex-1">
        <img
          src={
            testimonial.avatarUrl ||
            "https://ui-avatars.com/api/?name=" +
              encodeURIComponent(testimonial.name)
          }
          alt={testimonial.name}
          className="w-11 h-11 rounded-full object-cover border-2 border-gray-100 shrink-0"
        />
        <div className="overflow-hidden space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-gray-900 text-sm sm:text-base">
              {testimonial.name}
            </span>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                testimonial.approved
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
            >
              {testimonial.approved ? "Approved" : "Pending"}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-700 italic bg-gray-50/60 p-3 rounded-xl border border-gray-100">
            &ldquo;{testimonial.quote}&rdquo;
          </p>
          <p className="text-[10px] sm:text-xs text-gray-400">
            Created:{" "}
            {testimonial.createdAt
              ? new Date(testimonial.createdAt).toLocaleString()
              : "N/A"}
          </p>
        </div>
      </div>

      <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto shrink-0 justify-end">
        {!testimonial.approved && (
          <button
            onClick={() => onApprove(testimonial._id)}
            className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition shadow-xs"
          >
            Approve
          </button>
        )}
        <button
          onClick={() => onDelete(testimonial._id)}
          className="flex-1 sm:flex-none px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition shadow-xs"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
