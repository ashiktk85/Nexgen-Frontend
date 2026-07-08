import React from "react";

const StatCard = ({ icon, value, label, gradient, shadow, onClick }) => {
    return (
        <div
            className={`ejl-stat-card relative p-4 rounded-[14px] overflow-hidden transition-all duration-300 hover:-translate-y-1 ${onClick ? "cursor-pointer" : ""}`}
            style={{
                background: gradient,
                boxShadow: shadow || "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
            }}
            onClick={onClick}
            onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") onClick(e); } : undefined}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            {/* Background blobs */}
            <div
                className="ejl-stat-blob absolute bg-white/10 rounded-full blur-[10px]"
                style={{ width: 70, height: 70, top: -18, right: -18 }}
            />
            <div
                className="ejl-stat-blob absolute bg-white/10 rounded-full blur-[8px]"
                style={{ width: 45, height: 45, bottom: -10, left: 12 }}
            />

            <div className="relative z-10">
                {/* Icon */}
                <div className="w-[34px] h-[34px] rounded-lg bg-white/20 flex items-center justify-center mb-2.5 text-white">
                    {icon}
                </div>

                <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-3">
                     {/* Value */}
                <p className="text-[22px] font-extrabold text-white m-0 pb-[2px] leading-none font-sans">
                    {value}
                </p>

                {/* Label */}
                <p className="text-sm sm:text-md font-semibold text-white m-0 leading-snug">
                    {label}
                </p>
                </div>

               
            </div>
        </div>
    );
};

export default StatCard;
