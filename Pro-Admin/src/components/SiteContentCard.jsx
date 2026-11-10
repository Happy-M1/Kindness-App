// Pro-Admin/src/components/SiteContentCard.jsx
export default function SiteContentCard({ item, onEdit }) {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 min-w-37.5 transition hover:shadow-md">
      <div className="overflow-hidden space-y-1.5 flex-1 w-full">
        <span className="font-bold text-gray-900 text-sm sm:text-base font-mono bg-gray-100 px-2.5 py-1 rounded-lg">
          {item.key}
        </span>
        <pre className="text-xs text-gray-600 bg-gray-50/80 p-3 rounded-xl border border-gray-100 max-h-36 overflow-auto whitespace-pre-wrap font-mono">
          {JSON.stringify(item.value, null, 2)}
        </pre>
      </div>

      <div className="shrink-0 w-full sm:w-auto flex justify-end">
        <button
          onClick={() => onEdit(item)}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition shadow-xs"
        >
          Edit JSON
        </button>
      </div>
    </div>
  );
}
