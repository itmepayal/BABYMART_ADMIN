import { useUsersStore } from "@/store/users/useUsersStore";
import { useEffect } from "react";

export const useUsers = () => {
  const {
    users,
    selectedUser,
    selectedAddress,
    loading,
    error,
    total,
    page,
    pages,
    limit,
    search,
    isFetchingUsers,
    createUser,
    fetchUsers,
    getUserById,
    getSingleAddress,
    updateUser,
    deleteUser,
    bulkPermanentDeleteUsers,
    bulkDeleteUsers,
    bulkRestoreUsers,
    setSearch,
    setLimit,
    clearUsers,
    changeAvatarUser,
  } = useUsersStore();

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    selectedUser,
    selectedAddress,
    loading,
    error,
    total,
    page,
    pages,
    limit,
    search,
    createUser,
    isFetchingUsers,
    refetch: fetchUsers,
    getUserById,
    getSingleAddress,
    deleteUser,
    setSearch,
    setLimit,
    clearUsers,
    changeAvatarUser,
    updateUser,
    bulkPermanentDeleteUsers,
    bulkDeleteUsers,
    bulkRestoreUsers,
  };
};
