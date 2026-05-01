import { createBrowserRouter } from "react-router-dom";
import App from "@/App";

// ================= AUTH PAGES =================
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

// ================= DASHBOARD CORE =================
import Dashboard from "@/pages/dashboard/Dashboard";
import Products from "@/pages/dashboard/products/Products";
import Orders from "@/pages/dashboard/orders/Orders";

// ================= USER MANAGEMENT =================
import UsersPage from "@/pages/dashboard/users/Users";
import CreateUserPage from "@/pages/dashboard/users/CreateUser";
import EditUserPage from "@/pages/dashboard/users/EditUser";

// ================= BILLING / INVOICES =================
import Invoices from "@/pages/dashboard/invoices/Invoice";

// ================= BRAND MANAGEMENT =================
import BrandsPage from "@/pages/dashboard/products/brands/Brands";
import CreateBrandPage from "@/pages/dashboard/products/brands/CreateBrand";
import EditBrandPage from "@/pages/dashboard/products/brands/EditBrand";

// ================= CATEGORY MANAGEMENT =================
import CategoriesPage from "@/pages/dashboard/products/category/Categories";
import CreateCategoryPage from "@/pages/dashboard/products/category/CreateCategory";
import EditCategoryPage from "@/pages/dashboard/products/category/EditCategory";

// ================= BANNER MANAGEMENT =================
import BannersPage from "@/pages/dashboard/products/banner/Banners";
import CreateBannerPage from "@/pages/dashboard/products/banner/CreateBanner";
import EditBannerPage from "@/pages/dashboard/products/banner/EditBanner";

// ================= ROUTE PROTECTION =================
import { ProtectedRoute, PublicRoute, AdminRoute } from "@/routes/Protection";

// ======================================================
// APPLICATION ROUTER CONFIGURATION
// ======================================================
export const router = createBrowserRouter([
  // ======================================================
  // PUBLIC ROUTES (Accessible without authentication)
  // ======================================================
  {
    element: <PublicRoute />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },

  // ======================================================
  // PROTECTED ROUTES (Authenticated users only)
  // ======================================================
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <App />,
        children: [
          // ================= DASHBOARD =================
          { index: true, element: <Dashboard /> },
          { path: "/dashboard", element: <Dashboard /> },

          // ================= PRODUCT MODULE =================
          { path: "/dashboard/products", element: <Products /> },
          { path: "/dashboard/orders", element: <Orders /> },

          // ================= BRAND MODULE =================
          { path: "/dashboard/brands", element: <BrandsPage /> },
          {
            path: "/dashboard/brands/create",
            element: <CreateBrandPage />,
          },
          {
            path: "/dashboard/brands/edit/:id",
            element: <EditBrandPage />,
          },

          // ================= CATEGORY MODULE =================
          { path: "/dashboard/categories", element: <CategoriesPage /> },
          {
            path: "/dashboard/categories/create",
            element: <CreateCategoryPage />,
          },
          {
            path: "/dashboard/categories/edit/:id",
            element: <EditCategoryPage />,
          },

          // ================= BANNER MODULE =================
          { path: "/dashboard/banners", element: <BannersPage /> },
          { path: "/dashboard/banners/create", element: <CreateBannerPage /> },
          { path: "/dashboard/banners/edit/:id", element: <EditBannerPage /> },

          // ======================================================
          // ADMIN ONLY ROUTES
          // ======================================================
          {
            element: <AdminRoute />,
            children: [
              // ================= USER MODULE =================
              { path: "/dashboard/users", element: <UsersPage /> },
              {
                path: "/dashboard/users/create",
                element: <CreateUserPage />,
              },
              {
                path: "/dashboard/users/edit/:userId",
                element: <EditUserPage />,
              },

              // ================= BILLING MODULE =================
              { path: "/dashboard/invoices", element: <Invoices /> },
            ],
          },
        ],
      },
    ],
  },
]);
