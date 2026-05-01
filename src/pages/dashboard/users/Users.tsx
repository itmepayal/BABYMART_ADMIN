import {
  DeleteButton,
  EditButton,
  ViewButton,
} from "@/components/common/Action";
import { Header } from "@/components/dashbaord/Header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUsers } from "@/hooks/users/useUsers";
import {
  Loader2Icon,
  XCircle,
  Mail,
  ShieldCheck,
  User,
  Search,
  Truck,
  Trash2,
  Trash,
  RotateCcw,
} from "lucide-react";
import { FiRefreshCw, FiUserPlus, FiUsers } from "react-icons/fi";
import { defaultAvatar } from "@/assets";
import { Pagination } from "@/components/dashbaord/Pagination";
import { ConfirmModal } from "@/components/dashbaord/ConfirmModal";
import { useState } from "react";
import type { User as UserType } from "@/types/users";
import { UserViewModal } from "@/components/dashbaord/UserViewModal";
import { UserSkeleton } from "@/components/skeletons/UserSkeleton";
import { useNavigate } from "react-router-dom";

const UsersPage = () => {
  const {
    users,
    loading,
    error,
    total,
    page,
    pages,
    refetch,
    deleteUser,
    search,
    setSearch,
    isFetchingUsers,
    bulkRestoreUsers,
    bulkPermanentDeleteUsers,
    bulkDeleteUsers,
  } = useUsers();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [viewUser, setViewUser] = useState<UserType | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [permanentDeleteOpen, setPermanentDeleteOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  if (error)
    return (
      <div className="flex items-center justify-center p-6">
        <div className="w-full bg-white border border-red-200 rounded-2xl shadow-sm p-6 text-center">
          {/* ICON */}
          <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-red-100 mb-4">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>

          {/* TITLE */}
          <h2 className="text-lg font-semibold text-gray-900">
            Something went wrong
          </h2>

          {/* MESSAGE */}
          <p className="mt-2 text-sm text-gray-500">{error}</p>

          {/* ACTION */}
          <button
            onClick={() => refetch()}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
          >
            <FiRefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );

  if (loading) {
    return <UserSkeleton />;
  }

  const toggleUserSelection = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id)
        ? prev.filter((userId) => userId !== id)
        : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((user) => user._id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) return;

    await bulkDeleteUsers(selectedUsers);
    setSelectedUsers([]);
    setBulkDeleteOpen(false);
  };

  const handlePermanentDelete = async () => {
    if (selectedUsers.length === 0) return;
    await bulkPermanentDeleteUsers(selectedUsers);
    setSelectedUsers([]);
    setPermanentDeleteOpen(false);
  };

  const handleBulkRestore = async () => {
    if (selectedUsers.length === 0) return;

    await bulkRestoreUsers(selectedUsers);
    setSelectedUsers([]);
  };

  const getUserStatus = (user: UserType) => {
    if (user.isDeleted) return "deleted";
    if (user.isBlocked) return "blocked";
    return "active";
  };

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <Header
        title="Users Management"
        description="Manage users, roles, and permissions."
        icon={FiUsers}
        actionLabel="Add User"
        actionIcon={FiUserPlus}
        onAction={() => navigate("/dashboard/users/create")}
        refreshIcon={FiRefreshCw}
        onRefresh={refetch}
        isRefreshing={loading}
      />

      {/* ================= FILTERS ================= */}
      <div className="flex items-center justify-between gap-3 bg-white py-3 px-3 rounded-2xl border shadow-sm">
        {/* SEARCH */}
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              refetch({ search: e.target.value, page: 1 });
            }}
            placeholder="Search users by name or email..."
            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white 
                 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                 transition"
          />

          {/* ICON */}
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>
      {/* ================= TABLE ================= */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {/* TOP BAR */}
        <div
          className={`${selectedUsers.length ? "border-b border-slate-100 bg-white px-6 py-4" : "border-b border-slate-100 bg-white"}`}
        >
          {selectedUsers.length > 0 && (
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* LEFT SECTION */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                  <span className="text-sm font-bold text-emerald-600">
                    {selectedUsers.length}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {selectedUsers.length} User Selected
                  </h3>
                  <p className="text-xs text-slate-500">
                    Bulk actions can be performed on selected users
                  </p>
                </div>
              </div>

              {/* RIGHT SECTION */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setBulkDeleteOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-red-700"
                >
                  <Trash2 size={16} />
                  Delete Selected
                </button>

                <button
                  onClick={() => setPermanentDeleteOpen(true)}
                  className="flex items-center gap-2  rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100"
                >
                  <Trash size={16} />
                  Permanent Delete
                </button>

                <button
                  onClick={handleBulkRestore}
                  className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-600 hover:bg-emerald-100"
                >
                  <RotateCcw size={16} />
                  Restore Selected
                </button>

                <button
                  onClick={() => setSelectedUsers([])}
                  className="flex items-center gap-2  rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  <XCircle size={16} />
                  Clear Selection
                </button>
              </div>
            </div>
          )}
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="w-[50px] text-center">
                  <input
                    type="checkbox"
                    checked={
                      users.length > 0 && selectedUsers.length === users.length
                    }
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </TableHead>

                <TableHead className="text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Avatar
                </TableHead>

                <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  User
                </TableHead>

                <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Email
                </TableHead>

                <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Role
                </TableHead>

                <TableHead className="text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </TableHead>

                <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Joined
                </TableHead>

                <TableHead className="text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isFetchingUsers ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-20">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2Icon className="h-6 w-6 animate-spin text-slate-400" />
                      <p className="text-sm font-medium text-slate-600">
                        Loading users...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-20 text-center">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-slate-600">
                        No users found
                      </p>
                      <p className="text-xs text-slate-400">
                        Try creating a new user
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow
                    key={user._id}
                    className="group border-t border-slate-100 transition hover:bg-slate-50/70"
                  >
                    {/* CHECKBOX */}
                    <TableCell className="text-center">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => toggleUserSelection(user._id)}
                        className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                    </TableCell>

                    {/* AVATAR */}
                    <TableCell className="text-center">
                      <img
                        src={user?.avatar?.url || defaultAvatar}
                        alt="avatar"
                        className="mx-auto h-11 w-11 rounded-full object-cover ring-2 ring-slate-100"
                      />
                    </TableCell>

                    {/* USER */}
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-900">
                          {user.firstname} {user.lastname}
                        </p>
                        <p className="text-xs text-slate-500">
                          ID: {user._id.slice(-6)}
                        </p>
                      </div>
                    </TableCell>

                    {/* EMAIL */}
                    <TableCell>
                      <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
                        <Mail className="h-3.5 w-3.5" />
                        {user.email}
                      </span>
                    </TableCell>

                    {/* ROLE */}
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 uppercase">
                        {user.role === "admin" && <ShieldCheck size={14} />}
                        {user.role === "user" && <User size={14} />}
                        {user.role === "deliveryMan" && <Truck size={14} />}
                        {user.role}
                      </span>
                    </TableCell>
                    {/* STATUS */}
                    <TableCell className="text-center">
                      {(() => {
                        const status = getUserStatus(user);

                        const base =
                          "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border transition";

                        const styles = {
                          deleted:
                            "bg-slate-100 text-slate-600 border-slate-200",
                          blocked: "bg-red-50 text-red-600 border-red-200",
                          active:
                            "bg-emerald-50 text-emerald-700 border-emerald-200",
                        };

                        const labels = {
                          deleted: "Deleted",
                          blocked: "Blocked",
                          active: "Active",
                        };

                        return (
                          <span className={`${base} ${styles[status]}`}>
                            <span
                              className={`h-2 w-2 rounded-full ${
                                status === "deleted"
                                  ? "bg-slate-400"
                                  : status === "blocked"
                                    ? "bg-red-500"
                                    : "bg-emerald-500"
                              }`}
                            />

                            {labels[status]}
                          </span>
                        );
                      })()}
                    </TableCell>

                    {/* DATE */}
                    <TableCell>
                      <span className="text-sm text-slate-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </TableCell>

                    {/* ACTIONS */}
                    <TableCell>
                      <div className="flex items-center justify-center gap-2 opacity-70 transition group-hover:opacity-100">
                        <EditButton
                          onClick={() =>
                            navigate(`/dashboard/users/edit/${user._id}`)
                          }
                        />

                        <DeleteButton
                          onClick={() => {
                            setSelectedUser(user);
                            setOpen(true);
                          }}
                        />

                        <ViewButton onClick={() => setViewUser(user)} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {/* =================  DELETE MODAL ================= */}
          <ConfirmModal
            open={open}
            userName={
              selectedUser
                ? `${selectedUser.firstname} ${selectedUser.lastname}`
                : ""
            }
            onClose={() => {
              setOpen(false);
              setSelectedUser(null);
            }}
            onConfirm={async () => {
              if (!selectedUser) return;

              await deleteUser(selectedUser._id);

              setOpen(false);
              setSelectedUser(null);
            }}
            loading={loading}
          />
          {/* ================= BULK DELETE MODAL ================= */}
          <ConfirmModal
            open={bulkDeleteOpen}
            userName={`${selectedUsers.length} users`}
            onClose={() => setBulkDeleteOpen(false)}
            onConfirm={handleBulkDelete}
            loading={loading}
          />

          {/* ================= PERMANENT DELETE MODAL ================= */}
          <ConfirmModal
            open={permanentDeleteOpen}
            userName={`${selectedUsers.length} users`}
            onClose={() => setPermanentDeleteOpen(false)}
            onConfirm={handlePermanentDelete}
            loading={loading}
          />
          <UserViewModal user={viewUser} onClose={() => setViewUser(null)} />
        </div>
      </div>
      {/* ================= PAGINATION ================= */}
      <Pagination
        page={page}
        pages={pages}
        total={total}
        onChange={(p) => refetch({ page: p })}
      />
    </div>
  );
};

export default UsersPage;
