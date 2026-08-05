function getVisiblePages(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) return [1, 2, 3, 4, 5, "end-ellipsis", totalPages];
  if (currentPage >= totalPages - 3) {
    return [
      1,
      "start-ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "start-ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "end-ellipsis",
    totalPages,
  ];
}

export default function DriversPagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) {
  const pages = getVisiblePages(currentPage, totalPages);

  const changePage = (page) => {
    const safePage = Math.min(Math.max(page, 1), totalPages);
    if (safePage !== currentPage) onPageChange?.(safePage);
  };

  return (
    <div className="flex items-center justify-between gap-2 px-4 py-5 sm:px-5 sm:py-6">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => changePage(currentPage - 1)}
        className="rounded-md border border-[#C9C9C9] px-3 py-2 text-xs text-[#5C595A] disabled:opacity-100 sm:px-4"
      >
        <span className="sm:hidden">←</span>
        <span className="hidden sm:inline">← Previous</span>
      </button>

      <div className="flex items-center gap-0.5 text-xs text-[#5C595A] sm:gap-1">
        {pages.map((page) =>
          typeof page === "string" ? (
            <span key={page} className="hidden px-2 sm:inline">...</span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => changePage(page)}
              className={`h-8 w-8 rounded-full ${
                totalPages > 4 && page !== 1 && page !== totalPages && page !== currentPage
                  ? "hidden sm:block "
                  : ""
              }${
                currentPage === page ? "bg-[#F1F9E9] text-[#2F7D46]" : "hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => changePage(currentPage + 1)}
        className="rounded-md border border-[#C9C9C9] px-3 py-2 text-xs text-[#5C595A] disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
      >
        <span className="sm:hidden">→</span>
        <span className="hidden sm:inline">Next →</span>
      </button>
    </div>
  );
}
