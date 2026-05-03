import { useStats } from "@/hooks/stats/useStats";
import { useAuthStore } from "@/store/auth/useAuthStore";
import { motion } from "framer-motion";
import { IndianRupee, Package, ShoppingCart, Users } from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#10b981", "#06b6d4", "#6366f1", "#f59e0b"];

const Dashboard = () => {
  const { user } = useAuthStore();
  const { stats: StatsData, loading } = useStats();

  const counts = StatsData?.counts || {
    users: 0,
    products: 0,
    categories: 0,
    brands: 0,
    orders: 0,
  };
  const revenue = StatsData?.revenue || 0;
  const categoryData =
    StatsData?.productsByCategory?.map((item) => ({
      name: item.categoryName,
      value: item.count,
    })) || [];

  const roleData =
    StatsData?.roles?.map((item) => ({
      name: item._id,
      value: item.count,
    })) || [];

  const revenueData = [
    { name: "Jan", revenue: 3200 },
    { name: "Feb", revenue: 4500 },
    { name: "Mar", revenue: 5100 },
    { name: "Apr", revenue: 6900 },
    { name: "May", revenue: 8200 },
    { name: "Jun", revenue: 10500 },
  ];

  const stats = [
    {
      title: "Revenue",
      value: `₹${revenue}`,
      icon: IndianRupee,
    },
    {
      title: "Orders",
      value: counts.orders || 0,
      icon: ShoppingCart,
    },
    {
      title: "Products",
      value: counts.products || 0,
      icon: Package,
    },
    {
      title: "Brands",
      value: counts.brands || 0,
      icon: Package,
    },
    {
      title: "Customers",
      value: counts.users || 0,
      icon: Users,
    },
  ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-400 animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto space-y-10">
        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 p-8 text-white shadow-xl"
        >
          <div className="absolute -top-16 -right-16 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-2xl" />

          <h1 className="text-3xl font-semibold">
            Welcome back, {user?.firstname} 👋
          </h1>
          <p className="mt-2 text-sm opacity-90">
            Here’s what’s happening with your store today.
          </p>
        </motion.div>

        {/* STATS */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {stats.map((item, i) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative rounded-3xl border border-slate-200 bg-white/70 backdrop-blur p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 rounded-3xl" />

                <div className="relative flex justify-between">
                  <div>
                    <p className="text-xs text-slate-400 uppercase">
                      {item.title}
                    </p>
                    <h3 className="text-2xl font-semibold">{item.value}</h3>
                  </div>

                  <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl group-hover:scale-110 transition">
                    <Icon size={18} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="h-px bg-slate-200/60" />

        {/* REVENUE */}
        <div className="rounded-3xl bg-gradient-to-br from-white to-slate-50 p-6 shadow-md border">
          <h2 className="text-lg font-semibold mb-6">Revenue Overview</h2>

          <div className="h-80">
            <ResponsiveContainer>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <XAxis dataKey="name" />
                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={3}
                  fill="url(#rev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART GRID */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* CATEGORY */}
          <div className="rounded-3xl bg-white/70 backdrop-blur p-6 shadow-sm border hover:shadow-md transition">
            <h2 className="text-lg font-semibold mb-4">Products by Category</h2>

            <div className="h-72">
              <ResponsiveContainer>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <Tooltip />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                    {categoryData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ROLES */}
          <div className="rounded-3xl bg-white/70 backdrop-blur p-6 shadow-sm border hover:shadow-md transition">
            <h2 className="text-lg font-semibold mb-4">User Roles</h2>

            <div className="h-72 flex items-center justify-center">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={roleData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={90}
                    innerRadius={50}
                    paddingAngle={4}
                  >
                    {roleData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
