import { useNavigate } from "react-router-dom";

/* eslint-disable react/prop-types */
export default function ActionButton({ icon, label, panelChange, disable, share }) {
    const navigate = useNavigate();
    return (
        <button
            onClick={() => navigate(panelChange)}
            aria-label={label}
            disabled={disable === "used" ? true : disable === "expired" ? true : false}
            className="flex items-center cursor-pointer justify-center w-8 h-8 rounded-lg bg-transparent hover:border hover:border-white/10
        text-white/30 hover:text-white/80 hover:bg-white/[0.07] disabled:cursor-not-allowed  transition-all duration-200">
            {icon}
        </button>
    );
}
