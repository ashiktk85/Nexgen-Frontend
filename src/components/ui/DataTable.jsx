import { useMemo, useState, useEffect } from "react";
import { Ban, Edit, Trash2, Ticket, MoreHorizontal } from "lucide-react";
import { SearchInput } from "./SearchInput";
import { displayValue } from "@/utils/tableValue";
import Pagination from "./Pagination";

function getCellValue(item, column) {
    if (column.cell) return column.cell(item);
    let value;
    if (typeof column.accessor === "function") {
        value = column.accessor(item);
    } else if (column.accessor) {
        value = item[column.accessor];
    } else {
        value = "";
    }
    return displayValue(value);
}

export function DataTable({
    data,
    columns,
    loading = false,
    compact = false,
    title,
    badge,
    onView,
    onEdit,
    onDelete,
    onBlock,
    onTickets,
    onViewDetails,
    onOthers,
    showActions = true,
    selectable = true,
    getRowId = (row) => row.id || row._id || String(row),
    searchValue = "",
    onSearchChange,
    searchPlaceholder = "Search...",
    filterComponents,
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    viewDetailsLabel = "View",
    ticketsLabel,
    viewLabel = "View",
    editLabel,
    deleteLabel,
    othersLabel,
    blockLabel,
    showSno = false,
    rowsPerPage = 10,
    clientSidePagination = false,
    responsiveCards = false,
}) {
    const [sortDescriptor, setSortDescriptor] = useState({
        column: columns[0]?.id || "",
        direction: "ascending",
    });
    const [selectedRows, setSelectedRows] = useState(new Set());
    const [isMobile, setIsMobile] = useState(() =>
        typeof window !== "undefined" ? window.innerWidth < 768 : false
    );

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 767px)");
        const onChange = (e) => setIsMobile(e.matches);
        mq.addEventListener("change", onChange);
        setIsMobile(mq.matches);
        return () => mq.removeEventListener("change", onChange);
    }, []);

    const showCardLayout = responsiveCards && isMobile;

    const sortedItems = useMemo(() => {
        if (!sortDescriptor.column || !data) return data || [];

        return [...data].sort((a, b) => {
            const column = columns.find((col) => col.id === sortDescriptor.column);
            if (!column || !column.sortable) return 0;

            let first;
            let second;

            if (typeof column.accessor === "function") {
                first = column.accessor(a);
                second = column.accessor(b);
            } else if (column.accessor) {
                first = a[column.accessor];
                second = b[column.accessor];
            }

            if (typeof first === "string" && typeof second === "string") {
                let cmp = first.localeCompare(second);
                if (sortDescriptor.direction === "descending") {
                    cmp *= -1;
                }
                return cmp;
            }

            if (typeof first === "number" && typeof second === "number") {
                return sortDescriptor.direction === "descending" ? second - first : first - second;
            }

            return 0;
        });
    }, [data, sortDescriptor, columns]);

    const paginatedItems = useMemo(() => {
        if (!onPageChange || !clientSidePagination) return sortedItems;
        const start = (currentPage - 1) * rowsPerPage;
        return sortedItems.slice(start, start + rowsPerPage);
    }, [sortedItems, onPageChange, clientSidePagination, currentPage, rowsPerPage]);

    const displayItems = paginatedItems;

    const effectiveTotalPages = clientSidePagination
        ? Math.max(1, Math.ceil(sortedItems.length / rowsPerPage))
        : totalPages;

    const handleSort = (columnId) => {
        const column = columns.find((col) => col.id === columnId);
        if (!column?.sortable) return;

        setSortDescriptor((prev) => ({
            column: columnId,
            direction: prev.column === columnId && prev.direction === "ascending" ? "descending" : "ascending",
        }));
    };

    const toggleRowSelection = (rowId) => {
        const newSelected = new Set(selectedRows);
        if (newSelected.has(rowId)) {
            newSelected.delete(rowId);
        } else {
            newSelected.add(rowId);
        }
        setSelectedRows(newSelected);
    };

    const toggleSelectAll = () => {
        if (selectedRows.size === sortedItems.length) {
            setSelectedRows(new Set());
        } else {
            setSelectedRows(new Set(sortedItems.map(getRowId)));
        }
    };

    const getBlockLabel = typeof blockLabel === "function" ? blockLabel : () => blockLabel || "Action";

    return (
        <div className="w-full rounded-xl border border-slate-200 bg-white overflow-hidden">
            {(title || badge || onSearchChange || filterComponents) && (
                <>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 px-3 sm:px-4 py-2.5 bg-slate-50/80">
                        <div className="flex items-center gap-2">
                            {title && <h3 className="text-base font-semibold text-slate-900">{title}</h3>}
                            {badge && (
                                <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700">
                                    {badge}
                                </span>
                            )}
                        </div>

                        {onSearchChange && !filterComponents && (
                            <SearchInput
                                value={searchValue}
                                onSearch={onSearchChange}
                                placeholder={searchPlaceholder}
                                className="w-full sm:w-56"
                                inputClassName="pl-8"
                            />
                        )}
                    </div>

                    {filterComponents && (
                        <div className="border-b border-gray-200 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100">
                            {filterComponents}
                        </div>
                    )}
                </>
            )}

            {showCardLayout ? (
                <div className="divide-y divide-slate-200 bg-white">
                    {loading ? (
                        Array.from({ length: 4 }).map((_, rowIndex) => (
                            <div key={`card-skeleton-${rowIndex}`} className="p-4 space-y-3 animate-pulse">
                                <div className="h-4 w-1/3 rounded bg-gray-200" />
                                <div className="h-3 w-2/3 rounded bg-gray-200" />
                                <div className="h-3 w-1/2 rounded bg-gray-200" />
                            </div>
                        ))
                    ) : displayItems.length > 0 ? (
                        displayItems.map((item, index) => {
                            const rowId = getRowId(item);
                            return (
                                <div key={rowId} className="p-4 space-y-2.5">
                                    {showSno && (
                                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                                            #{(currentPage - 1) * rowsPerPage + index + 1}
                                        </p>
                                    )}
                                    {columns.map((column) => (
                                        <div key={column.id} className="flex items-start justify-between gap-3 text-sm">
                                            <span className="text-slate-500 font-medium shrink-0">{column.header}</span>
                                            <span className="text-slate-800 text-right break-words min-w-0">{getCellValue(item, column)}</span>
                                        </div>
                                    ))}
                                    {showActions && (
                                        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                                            {onViewDetails && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onViewDetails(item); }}
                                                    className="cursor-pointer rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                                                >
                                                    {viewDetailsLabel}
                                                </button>
                                            )}
                                            {onView && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onView(item); }}
                                                    className="cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700"
                                                >
                                                    {viewLabel}
                                                </button>
                                            )}
                                            {onEdit && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                                                    className="inline-flex items-center justify-center p-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                                                    title="Edit"
                                                >
                                                    {editLabel || <Edit className="h-3.5 w-3.5" />}
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onDelete(item); }}
                                                    className="inline-flex items-center justify-center p-1.5 rounded-md bg-red-600 text-white hover:bg-red-700 shadow-sm"
                                                    title="Delete"
                                                >
                                                    {deleteLabel || <Trash2 className="h-3.5 w-3.5" />}
                                                </button>
                                            )}
                                            {onBlock && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onBlock(item); }}
                                                    className="px-3 py-1.5 text-xs rounded-lg font-semibold text-white bg-amber-500 hover:bg-amber-600"
                                                >
                                                    {getBlockLabel(item)}
                                                </button>
                                            )}
                                            {onOthers && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onOthers(item); }}
                                                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                                                >
                                                    {othersLabel || <MoreHorizontal className="h-4 w-4" />}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="px-4 py-8 text-center text-sm text-slate-500 bg-slate-50">
                            No records found
                        </div>
                    )}
                </div>
            ) : (
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="border-b border-slate-200 bg-slate-50/80">
                        <tr className={`text-left font-semibold text-slate-600 uppercase tracking-wider ${compact ? "text-[10px] leading-tight" : "text-xs"}`}>
                            {selectable && (
                                <th className={compact ? "px-2 py-1" : "px-4 py-3"}>
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.size === sortedItems.length && sortedItems.length > 0}
                                        onChange={toggleSelectAll}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </th>
                            )}
                            {showSno && (
                                <th className={compact ? "px-2 py-1" : "px-4 py-3"}>
                                    S.No
                                </th>
                            )}
                            {columns.map((column) => (
                                <th
                                    key={column.id}
                                    className={`${compact ? "px-2 py-1" : "px-4 py-3"} ${column.sortable ? "cursor-pointer hover:text-slate-900" : ""} ${column.className || ""}`}
                                    onClick={() => column.sortable && handleSort(column.id)}
                                >
                                    <div className="flex items-center gap-1">
                                        {column.header}
                                        {column.sortable && sortDescriptor.column === column.id && (
                                            sortDescriptor.direction === "ascending" ? <span>&uarr;</span> : <span>&darr;</span>
                                        )}
                                    </div>
                                </th>
                            ))}
                            {showActions && <th className={`${compact ? "px-2 py-1" : "px-4 py-3"} text-center`}>Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {loading ? (
                            Array.from({ length: 5 }).map((_, rowIndex) => (
                                <tr key={`skeleton-${rowIndex}`} className="animate-pulse">
                                    {selectable && (
                                        <td className={compact ? "px-2 py-1" : "px-4 py-3"}>
                                            <div className="h-4 w-4 rounded bg-gray-200" />
                                        </td>
                                    )}
                                    {showSno && (
                                        <td className={compact ? "px-2 py-1" : "px-4 py-3"}>
                                            <div className="h-4 w-6 rounded bg-gray-200" />
                                        </td>
                                    )}
                                    {columns.map((column) => (
                                        <td key={`skeleton-col-${column.id}`} className={compact ? "px-2 py-1" : "px-4 py-3"}>
                                            <div className={`${compact ? "h-2.5" : "h-4"} rounded bg-gray-200 w-20`} />
                                        </td>
                                    ))}
                                    {showActions && (
                                        <td className={compact ? "px-2 py-1" : "px-4 py-3"}>
                                            <div className="flex justify-center gap-1.5">
                                                <div className={compact ? "h-5 w-5 rounded bg-gray-200" : "h-7 w-7 rounded bg-gray-200"} />
                                                <div className={compact ? "h-5 w-5 rounded bg-gray-200" : "h-7 w-7 rounded bg-gray-200"} />
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : displayItems.length > 0 ? (
                            displayItems.map((item, index) => {
                                const rowId = getRowId(item);
                                return (
                                    <tr key={rowId} className="hover:bg-slate-50/60 transition-colors">
                                        {selectable && (
                                            <td className={compact ? "px-2 py-1" : "px-4 py-3"}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRows.has(rowId)}
                                                    onChange={() => toggleRowSelection(rowId)}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                />
                                            </td>
                                        )}
                                        {showSno && (
                                            <td className={compact ? "px-2 py-1 text-[11px] text-slate-700 font-medium" : "px-4 py-3 text-sm text-slate-700 font-medium"}>
                                                {(currentPage - 1) * rowsPerPage + index + 1}
                                            </td>
                                        )}
                                        {columns.map((column) => (
                                            <td key={column.id} className={`${compact ? "px-2 py-1 text-[11px]" : "px-4 py-3 text-sm"} text-slate-700 ${column.className || ""}`}>
                                                {getCellValue(item, column)}
                                            </td>
                                        ))}
                                        {showActions && (
                                            <td className={compact ? "px-2 py-1" : "px-4 py-3"}>
                                                <div className={`flex justify-center ${compact ? "gap-1" : "gap-2"}`}>
                                                    {onViewDetails && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); onViewDetails(item); }}
                                                            className={`cursor-pointer rounded-lg border border-slate-200 ${compact ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"} font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900`}
                                                            title="View Details"
                                                        >
                                                            {viewDetailsLabel}
                                                        </button>
                                                    )}
                                                    {onTickets && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); onTickets(item); }}
                                                            className="p-1.5 rounded-md text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
                                                            title={ticketsLabel || "Tickets"}
                                                        >
                                                            {ticketsLabel || <Ticket className="h-4 w-4" />}
                                                        </button>
                                                    )}
                                                    {onView && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); onView(item); }}
                                                            className={`cursor-pointer rounded-lg ${compact ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"} font-semibold text-white bg-indigo-600 hover:bg-indigo-700 border-0 transition-colors shadow-sm`}
                                                            title="View"
                                                        >
                                                            {viewLabel}
                                                        </button>
                                                    )}
                                                    {onEdit && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                                                            className={`inline-flex items-center justify-center ${compact ? "p-1" : "p-1.5"} rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer shadow-sm`}
                                                            title="Edit"
                                                        >
                                                            {editLabel || <Edit className="h-3.5 w-3.5" />}
                                                        </button>
                                                    )}
                                                    {onDelete && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); onDelete(item); }}
                                                            className={`inline-flex items-center justify-center ${compact ? "p-1" : "p-1.5"} rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer shadow-sm`}
                                                            title="Delete"
                                                        >
                                                            {deleteLabel || <Trash2 className="h-3.5 w-3.5" />}
                                                        </button>
                                                    )}
                                                    {onBlock && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); onBlock(item); }}
                                                            className={`${compact ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"} rounded-lg font-semibold text-white bg-amber-500 hover:bg-amber-600 border-0 transition-colors cursor-pointer shadow-sm`}
                                                            title={getBlockLabel(item)}
                                                        >
                                                            {getBlockLabel(item)}
                                                        </button>
                                                    )}
                                                    {onOthers && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); onOthers(item); }}
                                                            className={`${compact ? "p-1" : "p-1.5"} rounded-lg text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer`}
                                                            title={othersLabel || "More options"}
                                                        >
                                                            {othersLabel || <MoreHorizontal className="h-4 w-4" />}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                    <td
                                    colSpan={columns.length + (selectable ? 1 : 0) + (showActions ? 1 : 0) + (showSno ? 1 : 0)}
                                    className={`${compact ? "px-2 py-4 text-xs" : "px-4 py-8 text-sm"} text-center text-slate-500 bg-slate-50`}
                                >
                                    No records found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            )}

            {onPageChange && (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-slate-200 bg-slate-50/50 px-3 sm:px-4 py-3">
                    <div className="text-xs text-slate-500">
                        Page {currentPage} of {effectiveTotalPages}
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={effectiveTotalPages}
                        onPageChange={onPageChange}
                        variant="compact"
                        prevLabel="Previous"
                        nextLabel="Next"
                    />
                </div>
            )}
        </div>
    );
}
