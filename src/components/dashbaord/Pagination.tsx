import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

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
  const getPageNumbers = () => {
    const items: (number | string)[] = [];
    if (pages <= 7) {
      for (let i = 1; i <= pages; i++) items.push(i);
    } else {
      items.push(1);
      if (page > 3) items.push("...");
      for (
        let i = Math.max(2, page - 1);
        i <= Math.min(pages - 1, page + 1);
        i++
      ) {
        items.push(i);
      }
      if (page < pages - 2) items.push("...");
      items.push(pages);
    }
    return items;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <div className="rounded-xl bg-slate-50 px-4 py-2 text-slate-600">
            Page <span className="font-semibold text-slate-900">{page}</span> of{" "}
            <span className="font-semibold text-slate-900">{pages}</span>
          </div>

          {total !== undefined && (
            <div className="rounded-xl bg-slate-50 px-4 py-2 text-slate-600">
              Total{" "}
              <span className="font-semibold text-slate-900">{total}</span>{" "}
              records
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => onChange(1)}
            aria-label="First page"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>

          <button
            disabled={page === 1}
            onClick={() => onChange(page - 1)}
            aria-label="Previous page"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </button>

          {pageNumbers.map((item, index) =>
            item === "..." ? (
              <span
                key={`ellipsis-${index}`}
                className="flex h-10 w-10 items-center justify-center text-slate-400"
              >
                ...
              </span>
            ) : (
              <button
                key={item}
                onClick={() => onChange(Number(item))}
                aria-label={`Page ${item}`}
                aria-current={page === item ? "page" : undefined}
                className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-medium transition-all ${
                  page === item
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {item}
              </button>
            ),
          )}

          <button
            disabled={page === pages}
            onClick={() => onChange(page + 1)}
            aria-label="Next page"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>

          <button
            disabled={page === pages}
            onClick={() => onChange(pages)}
            aria-label="Last page"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
