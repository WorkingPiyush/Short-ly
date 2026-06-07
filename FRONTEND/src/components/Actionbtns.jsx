/* eslint-disable react/prop-types */
export default function ActionButton({ icon, label }) {
    return (
        <button
            aria-label={label}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-transparent border-none
        text-white/30 hover:text-white/80 hover:bg-white/[0.07] transition-all duration-200"
        >
            {icon}
        </button>
    );
}
