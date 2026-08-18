
"use client";

interface FilterChipProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export const FilterChip: React.FC<FilterChipProps> = ({ label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all duration-200 text-sm md:text-base ${isActive ? 'bg-purple-700 text-white shadow-[0_8px_30px_rgba(99,102,241,0.12)]' : 'bg-white text-slate-700 border border-slate-200 hover:bg-purple-50'}`}
    >
      {label}
    </button>
  );
};
