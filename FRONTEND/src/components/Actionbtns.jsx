import { useNavigate } from "react-router-dom";

/* eslint-disable react/prop-types */
export default function ActionButton({ icon, label, panelChange, disable }) {
    const navigate = useNavigate();
    return (
        <button
            onClick={() => navigate(panelChange)}
            aria-label={label}
            disabled={disable === "used" ? true : disable === "expired" ? true : false}
            className={`flex items-center justify-center cursor-pointer w-8 h-8 rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 ${disable === "active" ? "hover:text-emerald-600" : "hover:text-zinc-600"} dark:hover:text-white dark:hover:bg-zinc-800 bg-transparent hover:border hover:border-white/10  disabled:cursor-not-allowed  transition-all duration-200`}>
            {icon}
        </button>
    );
}
