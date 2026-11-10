// Pro-Admin/src/components/ParticipantCard.jsx
export default function ParticipantCard({ node, onClick }) {
  return (
    <div
      onClick={() => onClick(node)}
      className="bg-white border border-gray-200/80 rounded-xl p-3 sm:p-4 flex items-center justify-between gap-3 min-w-37.5 shadow-2xs cursor-pointer hover:border-blue-300 hover:shadow-md transition group"
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <img
          src={
            node.imageUrl ||
            "https://ui-avatars.com/api/?name=" +
              encodeURIComponent(node.username)
          }
          alt={node.username}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-gray-100 shrink-0 group-hover:border-blue-400 transition"
        />
        <div className="overflow-hidden">
          <p className="font-semibold text-gray-900 text-xs sm:text-sm truncate group-hover:text-blue-600 transition">
            {node.username}
          </p>
          <p className="text-[10px] sm:text-xs text-gray-400 truncate mt-0.5">
            {node.email}
          </p>
        </div>
      </div>
      <span className="text-[10px] sm:text-xs bg-blue-50 text-blue-600 font-semibold px-2 sm:px-2.5 py-1 rounded-lg border border-blue-100 shrink-0">
        View Tree
      </span>
    </div>
  );
}
