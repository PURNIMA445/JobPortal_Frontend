import { cn } from "@/lib/utils";

function BrassTack() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20 drop-shadow-md">
      <circle cx="12" cy="10" r="5" fill="#D1C3AD" stroke="#B8A88E" strokeWidth="1" />
      <circle cx="10" cy="8" r="2" fill="#FFF" fillOpacity="0.6" />
      <path d="M12 15 L11.5 22 L12.5 22 Z" fill="#8C7C61" />
    </svg>
  );
}

export default function Card({ children, className = "", outerClassName = "", ...props }) {
  return (
    <div
      className={cn(
        "relative p-2.5 rounded-[2rem] bg-[#E5ECE4] shadow-sm transition-transform duration-300 group",
        outerClassName
      )}
      {...props}
    >
      <BrassTack />
      <div className={cn("bg-white rounded-3xl p-6 h-full border border-white/50 shadow-sm relative flex flex-col", className)}>
        {children}
      </div>
    </div>
  );
}