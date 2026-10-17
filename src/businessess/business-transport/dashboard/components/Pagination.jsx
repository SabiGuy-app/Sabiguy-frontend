import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Reusable pagination bar.
 *
 * Usage:
 *   <Pagination
 *     currentPage={page}
 *     totalPages={totalPages}
 *     onPageChange={(page) => setPage(page)}
 *   />
 *
 * Page-number list collapses with an ellipsis once there are more than
 * 7 pages, e.g. 1 2 3 ... 8 9 10 (matches the Fleet screen).
 */
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = getPageList(currentPage, totalPages);

  return (
    <nav
      className="flex items-center justify-between pt-4"
      aria-label="Pagination"
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </button>

      <div className="flex items-center gap-1">
        {pages.map((page, i) =>
          page === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="px-2 text-sm text-gray-400 select-none"
            >
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? "page" : undefined}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                page === currentPage
                  ? "bg-green-50 text-[#005823]"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}

/**
 * Builds a page list like [1,2,3,'...',8,9,10] centered loosely
 * around the current page, always keeping the first and last page visible.
 */
function getPageList(current, total, siblings = 1) {
  const totalNumbers = siblings * 2 + 5; // first, last, current, 2 ellipses, siblings
  if (total <= totalNumbers) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(current - siblings, 1);
  const rightSibling = Math.min(current + siblings, total);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < total - 1;

  const pages = [1];

  if (showLeftEllipsis) pages.push("...");
  for (let p = leftSibling; p <= rightSibling; p++) {
    if (p !== 1 && p !== total) pages.push(p);
  }
  if (showRightEllipsis) pages.push("...");

  pages.push(total);

  return pages;
}