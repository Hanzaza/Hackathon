
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
            className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all duration-200 text-sm md:text-base
            ${isActive
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
        >
            {label}
        </button>
    );
};
