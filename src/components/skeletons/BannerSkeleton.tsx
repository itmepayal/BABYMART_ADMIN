import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const BannerSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* ================= HEADER SKELETON ================= */}
      <div className="flex items-center justify-between rounded-2xl border bg-white p-4">
        <div className="space-y-2">
          <div className="shimmer h-5 w-60 rounded bg-slate-200" />
          <div className="shimmer h-4 w-80 rounded bg-slate-200" />
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
          <Table className="min-w-[1100px]">
            {/* ================= TABLE HEADER ================= */}
            <TableHeader>
              <TableRow className="h-14 bg-slate-50 hover:bg-slate-50">
                {Array.from({ length: 8 }).map((_, index) => (
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

                  {/* Banner */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-14 rounded-2xl bg-slate-200 shimmer" />

                      <div className="space-y-2">
                        <div className="h-4 w-40 rounded bg-slate-200 shimmer" />
                        <div className="h-3 w-24 rounded bg-slate-100 shimmer" />
                      </div>
                    </div>
                  </TableCell>

                  {/* Title */}
                  <TableCell>
                    <div className="space-y-2">
                      <div className="h-4 w-52 rounded bg-slate-200 shimmer" />
                      <div className="h-4 w-36 rounded bg-slate-100 shimmer" />
                    </div>
                  </TableCell>

                  {/* Start From */}
                  <TableCell>
                    <div className="h-4 w-28 rounded bg-slate-200 shimmer" />
                  </TableCell>

                  {/* Created At */}
                  <TableCell>
                    <div className="h-4 w-28 rounded bg-slate-200 shimmer" />
                  </TableCell>

                  {/* Updated At */}
                  <TableCell>
                    <div className="h-4 w-28 rounded bg-slate-200 shimmer" />
                  </TableCell>

                  {/* Status */}
                  <TableCell className="text-center">
                    <div className="mx-auto h-7 w-24 rounded-full bg-slate-200 shimmer" />
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
