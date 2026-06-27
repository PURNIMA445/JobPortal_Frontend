import { cn } from "@/lib/utils";
import Card from "./Card";

export default function JobCard({
  title,
  company,
  location,
  type,
  salary,
  className = "",
  outerClassName = "",
  onClick,
}) {
  return (
    <Card
      onClick={onClick}
      outerClassName={cn(
        "cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all",
        outerClassName
      )}
      className={className}
    >
      {/* Job Title */}
      <h2 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
        {title}
      </h2>

      {/* Company */}
      <p className="mt-1 text-sm text-gray-600 font-medium mb-4">
        {company}
      </p>

      {/* Details */}
      <div className="mt-auto flex flex-wrap gap-2 text-xs font-semibold text-gray-700">
        <span className="bg-[#FDFBF7] border border-[#EAE5D9] px-3 py-1 rounded-full">
          📍 {location}
        </span>

        <span className="bg-[#FDFBF7] border border-[#EAE5D9] px-3 py-1 rounded-full">
          ⏱ {type}
        </span>

        {salary && (
          <span className="bg-[#FDFBF7] border border-[#EAE5D9] px-3 py-1 rounded-full">
            💰 {salary}
          </span>
        )}
      </div>
    </Card>
  );
}