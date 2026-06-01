/* eslint-disable react/prop-types */
import {
    Copy,
    Pencil,
    Share2,
    BarChart3,
    MoreHorizontal,
} from "lucide-react";

function LinkCards({ link }) {
    return (
        <div className="relative rounded-2xl max-w-2xl border bg-white p-6 shadow-sm">
            <div className="flex justify-between gap-4">
                {/* Left Side */}
                <div className="flex gap-4 flex-1">
                    <input type="checkbox" />

                    <img src={link.favicon} alt="" className="h-10 w-10 rounded-lg border" />
                    <div className="flex-1">
                        <h3 className="font-bold text-xl">
                            {link.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            <a href={link.shortUrl} className="text-blue-600 font-medium">
                                {link.shortUrl}
                            </a>
                            <button>
                                <Copy size={18} />
                            </button>
                        </div>

                        <p className="mt-2 text-gray-600">
                            ↳ {link.originalUrl}
                        </p>

                        <div className="flex gap-6 mt-4 text-sm text-gray-500">
                            <span>🔒 {link.clicks} Clicks</span>
                            <span>📅 {link.date}</span>
                            <span>🏷️ No Tags</span>
                        </div>
                    </div>
                </div>

                {/* Right Side */}
                <div className="flex gap-3">
                    <button>
                        <Pencil size={18} />
                    </button>

                    <button>
                        <Share2 size={18} />
                    </button>

                    <button>
                        <BarChart3 size={18} />
                    </button>

                    <button>
                        <MoreHorizontal size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LinkCards;