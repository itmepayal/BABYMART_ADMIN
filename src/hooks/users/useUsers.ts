import { useUsersStore } from "@/store/users/useUsersStore";
import { useEffect } from "react";

export const useUsers = () => {
  const {
    users,
    sellers,
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
    fetchSellers,

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
    sellers,

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
    refetch: fetchUsers,
    fetchSellers,

    getUserById,
    getSingleAddress,

    deleteUser,
    updateUser,

    bulkPermanentDeleteUsers,
    bulkDeleteUsers,
    bulkRestoreUsers,

    setSearch,
    setLimit,
    clearUsers,
    changeAvatarUser,
  };
};
