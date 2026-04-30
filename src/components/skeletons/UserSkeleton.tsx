import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const UserSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* ================= HEADER SKELETON ================= */}
      <div className="flex items-center justify-between bg-white border rounded-2xl p-4">
        <div className="space-y-2">
          <div className="h-4 w-48 bg-gray-200 rounded shimmer" />
          <div className="h-3 w-64 bg-gray-200 rounded shimmer" />
        </div>

        <div className="h-9 w-28 bg-gray-200 rounded-lg shimmer" />
      </div>

      {/* ================= FILTER SKELETON ================= */}
      <div className="bg-white border rounded-2xl p-4 flex items-center justify-between">
        <div className="h-10 w-80 bg-gray-200 rounded-lg shimmer" />
        <div className="flex gap-2">
          <div className="h-10 w-10 bg-gray-200 rounded-lg shimmer" />
          <div className="h-10 w-10 bg-gray-200 rounded-lg shimmer" />
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              {Array.from({ length: 8 }).map((_, i) => (
                <TableHead key={i}>
                  <div className="h-3 w-20 bg-gray-200 rounded mx-auto shimmer" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.from({ length: 6 }).map((_, row) => (
              <TableRow key={row} className="h-[68px]">
                <TableCell className="text-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 mx-auto shimmer" />
                </TableCell>

                <TableCell>
                  <div className="h-3 w-20 bg-gray-200 rounded shimmer" />
                </TableCell>

                <TableCell>
                  <div className="h-3 w-20 bg-gray-200 rounded shimmer" />
                </TableCell>

                <TableCell>
                  <div className="h-6 w-44 bg-gray-200 rounded-full shimmer" />
                </TableCell>

                <TableCell>
                  <div className="h-6 w-20 bg-gray-200 rounded-full shimmer" />
                </TableCell>

                <TableCell className="text-center">
                  <div className="h-6 w-20 bg-gray-200 rounded-full mx-auto shimmer" />
                </TableCell>

                <TableCell>
                  <div className="h-6 w-24 bg-gray-200 rounded-full shimmer" />
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded shimmer" />
                    <div className="w-8 h-8 bg-gray-200 rounded shimmer" />
                    <div className="w-8 h-8 bg-gray-200 rounded shimmer" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ================= PAGINATION SKELETON ================= */}
      <div className="flex items-center justify-between bg-white border rounded-2xl px-4 py-3">
        <div className="h-3 w-40 bg-gray-200 rounded shimmer" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded shimmer" />
          <div className="w-8 h-8 bg-gray-200 rounded shimmer" />
          <div className="w-8 h-8 bg-gray-200 rounded shimmer" />
          <div className="w-8 h-8 bg-gray-200 rounded shimmer" />
        </div>
      </div>
    </div>
  );
};
