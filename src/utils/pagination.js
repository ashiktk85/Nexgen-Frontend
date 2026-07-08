/**
 * Builds page items with ellipsis for large page counts.
 * Example: [1, 'ellipsis', 4, 5, 6, 'ellipsis', 20]
 */
export function getPaginationItems(currentPage, totalPages, siblingCount = 1) {
  if (totalPages <= 0) return [];
  if (totalPages === 1) return [{ type: "page", page: 1, key: "page-1" }];

  const pages = new Set([1, totalPages]);

  for (let i = currentPage - siblingCount; i <= currentPage + siblingCount; i += 1) {
    if (i >= 1 && i <= totalPages) pages.add(i);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const items = [];
  let previous = null;

  for (const page of sorted) {
    if (previous !== null && page - previous > 1) {
      items.push({ type: "ellipsis", key: `ellipsis-${previous}-${page}` });
    }
    items.push({ type: "page", page, key: `page-${page}` });
    previous = page;
  }

  return items;
}

export function getSafePage(currentPage, totalPages) {
  return Math.min(Math.max(1, currentPage), Math.max(1, totalPages));
}
