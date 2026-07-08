import { getPaginationItems } from "@/utils/pagination";

const VARIANTS = {
  default: {
    wrap: "flex justify-center items-center gap-1.5 flex-wrap",
    prevNext:
      "px-3.5 py-1.5 rounded-full border text-[13px] font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60",
    prevNextEnabled: "border-slate-200 bg-white text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 cursor-pointer",
    prevNextDisabled: "border-slate-200 bg-slate-50 text-slate-300",
    page: "min-w-[34px] h-[34px] px-2 rounded-[10px] border text-[13px] font-medium transition-all cursor-pointer",
    pageActive: "border-transparent bg-gradient-to-br from-indigo-600 to-indigo-500 text-white font-bold shadow-md shadow-indigo-200",
    pageInactive: "border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:text-indigo-600",
    ellipsis: "min-w-[28px] h-[34px] flex items-center justify-center text-slate-400 text-sm select-none",
  },
  compact: {
    wrap: "flex items-center gap-1",
    prevNext:
      "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors flex items-center gap-1 border disabled:cursor-not-allowed",
    prevNextEnabled: "border-slate-300 text-slate-700 hover:bg-slate-50 bg-white cursor-pointer",
    prevNextDisabled: "border-slate-200 text-slate-400 bg-slate-50",
    page: "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
    pageActive: "bg-indigo-600 text-white border border-indigo-600",
    pageInactive: "text-slate-600 hover:bg-slate-100 bg-white border border-slate-200",
    ellipsis: "px-1 text-slate-400 text-xs select-none",
  },
};

export function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = "",
  variant = "default",
  siblingCount = 1,
  showPrevNext = true,
  prevLabel = "Prev",
  nextLabel = "Next",
}) {
  if (!onPageChange || totalPages <= 1) return null;

  const styles = VARIANTS[variant] || VARIANTS.default;
  const items = getPaginationItems(currentPage, totalPages, siblingCount);
  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;

  return (
    <nav className={`${styles.wrap} ${className}`} aria-label="Pagination">
      {showPrevNext && (
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isFirst}
          className={`${styles.prevNext} ${isFirst ? styles.prevNextDisabled : styles.prevNextEnabled}`}
          aria-label="Previous page"
        >
          {prevLabel}
        </button>
      )}

      {items.map((item) =>
        item.type === "ellipsis" ? (
          <span key={item.key} className={styles.ellipsis} aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={item.key}
            type="button"
            onClick={() => onPageChange(item.page)}
            aria-label={`Page ${item.page}`}
            aria-current={item.page === currentPage ? "page" : undefined}
            className={`${styles.page} ${
              item.page === currentPage ? styles.pageActive : styles.pageInactive
            }`}
          >
            {item.page}
          </button>
        )
      )}

      {showPrevNext && (
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLast}
          className={`${styles.prevNext} ${isLast ? styles.prevNextDisabled : styles.prevNextEnabled}`}
          aria-label="Next page"
        >
          {nextLabel}
        </button>
      )}
    </nav>
  );
}

export default Pagination;
