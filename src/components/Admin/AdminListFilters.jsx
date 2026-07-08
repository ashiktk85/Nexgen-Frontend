import { ADMIN_SEARCH_INPUT } from "@/components/Admin/adminPageLayout";

const selectClass = `${ADMIN_SEARCH_INPUT} min-w-[130px] py-1.5 text-xs`;

export function AdminFilterSelect({ label, value, onChange, options }) {
  return (
    <label className="flex flex-col gap-1">
      {label && (
        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </span>
      )}
      <select value={value} onChange={onChange} className={selectClass}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function AdminFilterBar({ children }) {
  return (
    <div className="flex flex-wrap items-end gap-2 mb-3">{children}</div>
  );
}
