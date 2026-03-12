import React from "react";
import { Search } from "lucide-react";

export function SearchInput({
    value,
    onSearch,
    placeholder = "Search...",
    className = "",
    inputClassName = "",
}) {
    return (
        <div className={`relative flex items-center ${className}`}>
            <Search className="absolute left-2.5 h-4 w-4 text-gray-400" />
            <input
                type="text"
                value={value}
                onChange={(e) => onSearch(e.target.value)}
                placeholder={placeholder}
                className={`w-full rounded-md border border-gray-300 py-1.5 pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary ${inputClassName}`}
            />
        </div>
    );
}
