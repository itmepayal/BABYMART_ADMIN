import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  page: number;
  pages: number;
  total?: number;
  onChange: (page: number) => void;
};

export const Pagination = ({
  page,
  pages,
  total,
  onChange,
}: PaginationProps) => {
  const visiblePages = [];
  for (let i = Math.max(1, page - 2); i <= Math.min(pages, page + 2); i++) {
    visiblePages.push(i);
  }
  return (
    <div className="flex items-center justify-between px-4 py-4 bg-white border rounded-2xl shadow-sm text-sm">
      <div className="flex items-center gap-3 text-sm">
        {/* Page Info */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg  border text-gray-600">
          <span>Page</span>
          <span className="font-semibold text-gray-800">{page}</span>
          <span className="text-gray-400">/</span>
          <span className="font-semibold text-gray-800">{pages}</span>
        </div>

        {/* Divider */}
        <div className="h-4 w-px bg-gray-200" />

        {/* Total Records */}
        {total !== undefined && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg  border text-gray-600">
            <span className="font-semibold text-gray-800">{total}</span>
            <span className="text-gray-800">records</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border bg-gray-50 hover:bg-gray-100 disabled:opacity-40 transition group"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          Prev
        </button>
        {visiblePages.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`h-10 w-10 text-sm rounded-lg border transition ${
              p === page
                ? "bg-gradient-to-b from-emerald-600 via-teal-600 to-cyan-600 text-white"
                : "bg-gray-50 hover:bg-gray-100"
            }`}
          >
            {p}
          </button>
        ))}

        <button
          disabled={page === pages}
          onClick={() => onChange(page + 1)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border bg-gray-50 hover:bg-gray-100 disabled:opacity-40 transition group"
        >
          Next
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};
