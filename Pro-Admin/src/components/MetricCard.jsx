// Pro-Admin/src/components/MetricCard.jsx
export default function MetricCard({ icon, label, value, colorClass }) {
  return (
    <div className="bg-white/80 backdrop-blur-md p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200/80 flex items-center gap-3.5 sm:gap-4 min-w-37.5 transition hover:shadow-md">
      <div
        className={`p-3 sm:p-4 rounded-xl text-xl sm:text-2xl shrink-0 ${colorClass}`}
      >
        {icon}
      </div>
      <div className="overflow-hidden">
        <p className="text-[10px] sm:text-xs text-gray-500 font-semibold uppercase tracking-wider truncate">
          {label}
        </p>
        <p className="text-xl sm:text-3xl font-black text-gray-900 mt-0.5 truncate">
          {value}
        </p>
      </div>
    </div>
  );
}
