import { Header } from "@/components/dashbaord/Header";
import { useUsers } from "@/hooks/users/useUsers";
import { Tag } from "lucide-react";
import { FiPlus, FiRefreshCw } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Brands = () => {
  const { refetch } = useUsers();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <Header
        title="Brands Management"
        description="Manage product brands."
        icon={Tag}
        actionLabel="Add Brand"
        actionIcon={FiPlus}
        onAction={() => navigate("/dashboard/brands/create")}
        refreshIcon={FiRefreshCw}
        onRefresh={refetch}
        isRefreshing={false}
      />
      {/* ================= FILTERS ================= */}

      {/* ================= TABLE ================= */}

      {/* ================= PAGINATION ================= */}
    </div>
  );
};

export default Brands;
