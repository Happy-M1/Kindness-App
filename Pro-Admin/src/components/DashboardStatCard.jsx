// Pro-Admin/src/components/DashboardStatCard.jsx
export default function DashboardStatCard({
  icon,
  label,
  value,
  colorClass,
  valueTextColor = "text-gray-900",
}) {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-200/80 flex items-center justify-between min-w-37.5 transition hover:shadow-md">
      <div className="overflow-hidden">
        <p className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider truncate">
          {label}
        </p>
        <p
          className={`text-xl sm:text-2xl font-bold mt-1 truncate ${valueTextColor}`}
        >
          {value}
        </p>
      </div>
      <div
        className={`p-3 rounded-xl text-lg sm:text-xl shrink-0 ${colorClass}`}
      >
        {icon}
      </div>
    </div>
  );
}
