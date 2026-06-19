import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Header } from "@/components/dashbaord/Header";
import { Pagination } from "@/components/dashbaord/Pagination";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DeleteButton,
  EditButton,
  ViewButton,
} from "@/components/common/Action";

import { useUsers } from "@/hooks/users/useUsers";

import {
  Loader2Icon,
  Search,
  Trash2,
  Trash,
  RotateCcw,
  XCircle,
  ShieldCheck,
  User,
  Truck,
  Users,
} from "lucide-react";

import { FiRefreshCw, FiUserPlus } from "react-icons/fi";

import { defaultAvatar } from "@/assets";

import { ConfirmModal } from "@/components/dashbaord/ConfirmModal";
import { UserViewModal } from "@/components/dashbaord/UserViewModal";
import { UserSkeleton } from "@/components/skeletons/UserSkeleton";

import type { User as UserType } from "@/types/user.type";

const UsersPage = () => {
  const navigate = useNavigate();

  // ================= STATE =================
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [viewUser, setViewUser] = useState<UserType | null>(null);

  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [permanentDeleteOpen, setPermanentDeleteOpen] = useState(false);

  // ================= DATA =================
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

  // ================= FILTER =================
  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      `${user.firstname} ${user.lastname}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [users, search]);

  // ================= SELECTION =================
  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((user) => user._id));
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id)
        ? prev.filter((userId) => userId !== id)
        : [...prev, id],
    );
  };

  const isAllSelected =
    filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length;

  // ================= BULK ACTIONS =================
  const handleBulkDelete = async () => {
    await bulkDeleteUsers(selectedUsers);
    setSelectedUsers([]);
  };

  const handlePermanentDelete = async () => {
    await bulkPermanentDeleteUsers(selectedUsers);
    setSelectedUsers([]);
  };

  const handleBulkRestore = async () => {
    await bulkRestoreUsers(selectedUsers);
    setSelectedUsers([]);
  };

  // ================= STATUS =================
  const getUserStatus = (user: UserType) => {
    if (user.isDeleted) return "deleted";
    if (user.isBlocked) return "blocked";
    return "active";
  };

  // ================= ERROR =================
  if (error) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="w-full rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>

          <h2 className="text-lg font-semibold text-slate-900">
            Something went wrong
          </h2>

          <p className="mt-2 text-sm text-slate-500">{error}</p>

          <button
            onClick={() => refetch()}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
          >
            <FiRefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ================= SKELETON =================
  if (loading) {
    return <UserSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* ================= PAGE HEADER ================= */}
      <Header
        title="Users Management"
        description="Manage users, roles, permissions, and account access."
        icon={Users}
        actionLabel="Add User"
        actionIcon={FiUserPlus}
        onAction={() => navigate("/dashboard/users/create")}
        refreshIcon={FiRefreshCw}
        onRefresh={refetch}
        isRefreshing={loading}
      />

      {/* ================= SEARCH BAR ================= */}
      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              refetch({ search: e.target.value, page: 1 });
            }}
            placeholder="Search users by name or email..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-10 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ================= TABLE SECTION ================= */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* ================= BULK ACTION TOOLBAR ================= */}
        {selectedUsers.length > 0 && (
          <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur-md">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* LEFT */}
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 shadow-sm">
                  <span className="text-base font-bold text-emerald-700">
                    {selectedUsers.length}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {selectedUsers.length} User
                    {selectedUsers.length > 1 ? "s" : ""} Selected
                  </h3>

                  <p className="text-xs text-slate-500">
                    Manage selected users with bulk actions
                  </p>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleBulkRestore}
                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
                >
                  <RotateCcw size={16} />
                  Restore
                </button>

                <button
                  onClick={() => setBulkDeleteOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-amber-600"
                >
                  <Trash2 size={16} />
                  Delete
                </button>

                <button
                  onClick={() => setPermanentDeleteOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-red-700"
                >
                  <Trash size={16} />
                  Permanent Delete
                </button>

                <button
                  onClick={() => setSelectedUsers([])}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <XCircle size={16} />
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= TABLE ================= */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <Table className="min-w-[1200px]">
            <TableHeader>
              <TableRow className="h-14! bg-slate-50 hover:bg-slate-50">
                <TableHead className="w-[50px] text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                </TableHead>

                <TableHead className="min-w-[280px]">User</TableHead>

                <TableHead className="min-w-[260px]">Email</TableHead>

                <TableHead className="w-[160px]">Role</TableHead>

                <TableHead className="w-[140px] text-center">Status</TableHead>

                <TableHead className="w-[160px] text-center">Joined</TableHead>

                <TableHead className="w-[150px] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isFetchingUsers ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2Icon className="h-6 w-6 animate-spin text-slate-400" />

                      <p className="text-sm text-slate-500">Loading users...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-20 text-center">
                    <p className="text-sm font-medium text-slate-600">
                      No users found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Try creating a new user
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => {
                  const userStatus = getUserStatus(user);

                  return (
                    <TableRow
                      key={user._id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      {/* CHECKBOX */}
                      <TableCell className="text-center">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user._id)}
                          onChange={() => toggleSelection(user._id)}
                          className="h-4 w-4 rounded border-slate-300"
                        />
                      </TableCell>

                      {/* USER */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar?.url || defaultAvatar}
                            alt={user.firstname}
                            className="h-12 w-12 rounded-xl border object-cover"
                          />

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">
                              {user.firstname} {user.lastname}
                            </p>

                            <p className="truncate text-xs text-slate-400">
                              ID: {user._id?.slice(0, 8)}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* EMAIL */}
                      <TableCell>
                        <span className="inline-flex items-center gap-2 text-sm text-slate-700">
                          {user.email}
                        </span>
                      </TableCell>

                      {/* ROLE */}
                      <TableCell>
                        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium uppercase text-emerald-700">
                          {user.role === "admin" && <ShieldCheck size={14} />}

                          {user.role === "user" && <User size={14} />}

                          {user.role === "deliveryMan" && <Truck size={14} />}

                          {user.role}
                        </span>
                      </TableCell>

                      {/* STATUS */}
                      <TableCell className="text-center">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            userStatus === "active"
                              ? "bg-emerald-50 text-emerald-700"
                              : userStatus === "blocked"
                                ? "bg-red-50 text-red-700"
                                : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {userStatus === "active"
                            ? "Active"
                            : userStatus === "blocked"
                              ? "Blocked"
                              : "Deleted"}
                        </span>
                      </TableCell>

                      {/* DATE */}
                      <TableCell className="text-center">
                        <span className="text-sm text-slate-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </TableCell>

                      {/* ACTIONS */}
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          {!user.isDeleted ? (
                            <>
                              <ViewButton onClick={() => setViewUser(user)} />

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
                            </>
                          ) : (
                            <button
                              onClick={async () => {
                                await bulkRestoreUsers([user._id]);

                                await refetch({
                                  page,
                                  search,
                                });
                              }}
                              className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 transition-all hover:bg-emerald-100"
                            >
                              <RotateCcw size={16} />
                              Restore
                            </button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {/* ================= SINGLE DELETE CONFIRMATION ================= */}
          <ConfirmModal
            open={open}
            userName={
              selectedUser
                ? `${selectedUser.firstname} ${selectedUser.lastname}`
                : "user"
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

          {/* ================= BULK DELETE CONFIRMATION ================= */}
          <ConfirmModal
            open={bulkDeleteOpen}
            userName={`${selectedUsers.length} users`}
            onClose={() => setBulkDeleteOpen(false)}
            onConfirm={async () => {
              await handleBulkDelete();
              setBulkDeleteOpen(false);
            }}
            loading={loading}
          />

          {/* ================= PERMANENT DELETE CONFIRMATION ================= */}
          <ConfirmModal
            open={permanentDeleteOpen}
            userName={`${selectedUsers.length} users`}
            onClose={() => setPermanentDeleteOpen(false)}
            onConfirm={async () => {
              await handlePermanentDelete();
              setPermanentDeleteOpen(false);
            }}
            loading={loading}
          />

          {/* ================= VIEW USER ================= */}
          <UserViewModal user={viewUser} onClose={() => setViewUser(null)} />
        </div>

        {/* ================= PAGINATION ================= */}
        <Pagination
          page={page}
          pages={pages}
          total={total}
          onChange={(p) => refetch({ page: p })}
        />
      </div>
    </div>
  );
};

export default UsersPage;
