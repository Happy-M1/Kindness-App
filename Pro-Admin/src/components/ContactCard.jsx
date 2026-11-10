// Pro-Admin/src/components/ContactCard.jsx
export default function ContactCard({ contact, onToggleHandled }) {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 min-w-37.5 transition hover:shadow-md">
      <div className="overflow-hidden space-y-1.5 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-gray-900 text-sm sm:text-base">
            {contact.name}
          </span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {contact.email}
          </span>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${contact.handled ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}
          >
            {contact.handled ? "Handled" : "Pending"}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed bg-gray-50/60 p-3 rounded-xl border border-gray-100">
          {contact.message}
        </p>
        <p className="text-[10px] sm:text-xs text-gray-400">
          Submitted:{" "}
          {contact.createdAt
            ? new Date(contact.createdAt).toLocaleString()
            : "N/A"}
        </p>
      </div>

      <div className="shrink-0 w-full sm:w-auto flex justify-end">
        <button
          onClick={() => onToggleHandled(contact._id, !contact.handled)}
          className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition shadow-xs ${
            contact.handled
              ? "bg-amber-500 hover:bg-amber-600 text-white"
              : "bg-emerald-600 hover:bg-emerald-700 text-white"
          }`}
        >
          {contact.handled ? "Mark Unhandled" : "Mark Handled"}
        </button>
      </div>
    </div>
  );
}
