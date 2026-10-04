import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface AdminPaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  itemLabel?: string; // e.g. "অর্ডার", "পণ্য", "গ্রাহক"
}

export const AdminPagination: React.FC<AdminPaginationProps> = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  itemLabel = 'আইটেম',
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const startItem = totalItems === 0 ? 0 : (validCurrentPage - 1) * pageSize + 1;
  const endItem = Math.min(validCurrentPage * pageSize, totalItems);

  // Generate page numbers with ellipses
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, validCurrentPage - 1);
      let end = Math.min(totalPages - 1, validCurrentPage + 1);

      if (validCurrentPage <= 3) {
        start = 2;
        end = 4;
      } else if (validCurrentPage >= totalPages - 2) {
        start = totalPages - 3;
        end = totalPages - 1;
      }

      if (start > 2) {
        pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== validCurrentPage) {
      onPageChange(page);
    }
  };

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 pb-1 text-xs text-stone-600 border-t border-stone-100">
      {/* Left: Summary and Page Size Selector */}
      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
        <div className="font-medium text-stone-600">
          মোট <span className="font-bold text-stone-900">{totalItems}</span> টি {itemLabel}র মধ্যে{' '}
          <span className="font-bold text-stone-900">{startItem}-{endItem}</span> দেখানো হচ্ছে
        </div>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 text-stone-500">
            <span className="text-[11px]">প্রতি পেজে:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
                onPageChange(1);
              }}
              className="px-2 py-1 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg text-xs font-semibold text-stone-800 cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-700"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right: Pagination Controls */}
      <div className="flex items-center gap-1">
        {/* First Page */}
        <button
          onClick={() => handlePageClick(1)}
          disabled={validCurrentPage === 1}
          className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
          title="First Page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous Page */}
        <button
          onClick={() => handlePageClick(validCurrentPage - 1)}
          disabled={validCurrentPage === 1}
          className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Numeric Page Buttons */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((item, idx) => {
            if (item === '...') {
              return (
                <span key={`dots-${idx}`} className="px-2 py-1 text-stone-400 font-bold select-none">
                  …
                </span>
              );
            }

            const pageNum = Number(item);
            const isActive = pageNum === validCurrentPage;

            return (
              <button
                key={pageNum}
                onClick={() => handlePageClick(pageNum)}
                className={`min-w-8 h-8 px-2.5 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center justify-center ${
                  isActive
                    ? 'bg-[#15803d] text-white shadow-2xs'
                    : 'border border-stone-200 hover:bg-stone-50 text-stone-700 hover:border-stone-300'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Page */}
        <button
          onClick={() => handlePageClick(validCurrentPage + 1)}
          disabled={validCurrentPage === totalPages}
          className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last Page */}
        <button
          onClick={() => handlePageClick(totalPages)}
          disabled={validCurrentPage === totalPages}
          className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
          title="Last Page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
