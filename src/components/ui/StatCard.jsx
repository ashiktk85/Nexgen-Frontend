import React from "react";

const StatCard = ({ icon, value, label, gradient, shadow, onClick, compact = false }) => {
    return (
        <div
            className={`ejl-stat-card relative rounded-[14px] overflow-hidden transition-all duration-300 hover:-translate-y-1 ${compact ? "p-3" : "p-4"} ${onClick ? "cursor-pointer" : ""}`}
            style={{
                background: gradient,
                boxShadow: shadow || "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
            }}
            onClick={onClick}
            onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") onClick(e); } : undefined}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            {!compact && (
              <>
                <div
                    className="ejl-stat-blob absolute bg-white/10 rounded-full blur-[10px]"
                    style={{ width: 70, height: 70, top: -18, right: -18 }}
                />
                <div
                    className="ejl-stat-blob absolute bg-white/10 rounded-full blur-[8px]"
                    style={{ width: 45, height: 45, bottom: -10, left: 12 }}
                />
              </>
            )}

            <div className="relative z-10">
                <div className={`${compact ? "w-[28px] h-[28px] mb-2" : "w-[34px] h-[34px] mb-2.5"} rounded-lg bg-white/20 flex items-center justify-center text-white`}>
                    {icon}
                </div>

                <div className="flex flex-col items-start gap-0.5 sm:flex-row sm:items-center sm:gap-2">
                <p className={`${compact ? "text-[18px]" : "text-[22px]"} font-extrabold text-white m-0 pb-[2px] leading-none font-sans`}>
                    {value}
                </p>
                <p className={`${compact ? "text-xs" : "text-sm sm:text-md"} font-semibold text-white m-0 leading-snug`}>
                    {label}
                </p>
                </div>
            </div>
        </div>
    );
};

export default StatCard;
