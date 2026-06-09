import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const ProductSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* ================= HEADER SKELETON ================= */}
      <div className="flex items-center justify-between rounded-2xl border bg-white p-4">
        <div className="space-y-2">
          <div className="shimmer h-5 w-56 rounded bg-slate-200" />
          <div className="shimmer h-4 w-72 rounded bg-slate-200" />
        </div>

        <div className="shimmer h-10 w-36 rounded-xl bg-slate-200" />
      </div>

      {/* ================= SEARCH SKELETON ================= */}
      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
        <div className="shimmer h-11 w-full max-w-md rounded-xl bg-slate-200" />
      </div>

      {/* ================= TABLE SECTION ================= */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <Table className="min-w-[1200px]">
            {/* ================= TABLE HEADER ================= */}
            <TableHeader>
              <TableRow className="h-14 bg-slate-50 hover:bg-slate-50">
                {Array.from({ length: 10 }).map((_, index) => (
                  <TableHead key={index}>
                    <div className="mx-auto h-4 w-20 rounded bg-slate-200 shimmer" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            {/* ================= TABLE BODY ================= */}
            <TableBody>
              {Array.from({ length: 8 }).map((_, index) => (
                <TableRow key={index} className="border-b border-slate-100">
                  {/* Checkbox */}
                  <TableCell className="text-center">
                    <div className="mx-auto h-4 w-4 rounded bg-slate-200 shimmer" />
                  </TableCell>

                  {/* Product */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-slate-200 shimmer" />

                      <div className="space-y-2">
                        <div className="h-4 w-40 rounded bg-slate-200 shimmer" />
                        <div className="h-3 w-24 rounded bg-slate-100 shimmer" />
                      </div>
                    </div>
                  </TableCell>

                  {/* Price */}
                  <TableCell className="text-center">
                    <div className="mx-auto h-4 w-16 rounded bg-slate-200 shimmer" />
                  </TableCell>

                  {/* Category */}
                  <TableCell>
                    <div className="h-7 w-24 rounded-full bg-slate-200 shimmer" />
                  </TableCell>

                  {/* Brand */}
                  <TableCell>
                    <div className="h-7 w-24 rounded-full bg-slate-200 shimmer" />
                  </TableCell>

                  {/* Discount */}
                  <TableCell className="text-center">
                    <div className="mx-auto h-7 w-20 rounded-full bg-slate-200 shimmer" />
                  </TableCell>

                  {/* Stock */}
                  <TableCell className="text-center">
                    <div className="mx-auto h-7 w-24 rounded-full bg-slate-200 shimmer" />
                  </TableCell>

                  {/* Rating */}
                  <TableCell className="text-center">
                    <div className="mx-auto h-7 w-16 rounded-full bg-slate-200 shimmer" />
                  </TableCell>

                  {/* Status */}
                  <TableCell className="text-center">
                    <div className="mx-auto h-7 w-20 rounded-full bg-slate-200 shimmer" />
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-9 w-9 rounded-xl bg-slate-200 shimmer" />
                      <div className="h-9 w-9 rounded-xl bg-slate-200 shimmer" />
                      <div className="h-9 w-9 rounded-xl bg-slate-200 shimmer" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* ================= PAGINATION SKELETON ================= */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-4">
          <div className="h-4 w-40 rounded bg-slate-200 shimmer" />

          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-slate-200 shimmer" />
            <div className="h-9 w-9 rounded-lg bg-slate-200 shimmer" />
            <div className="h-9 w-9 rounded-lg bg-slate-200 shimmer" />
            <div className="h-9 w-9 rounded-lg bg-slate-200 shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
};
