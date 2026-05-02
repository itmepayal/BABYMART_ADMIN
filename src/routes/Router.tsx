import { createBrowserRouter } from "react-router-dom";
import App from "@/App";

// ================= AUTH =================
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

// ================= DASHBOARD =================
import Dashboard from "@/pages/dashboard/Dashboard";

// ================= PRODUCTS =================
import ProductsPage from "@/pages/dashboard/products/product/Products";
import CreateProductPage from "@/pages/dashboard/products/product/CreateProduct";
import EditProductPage from "@/pages/dashboard/products/product/EditProduct";

// ================= OTHER MODULES =================
import Orders from "@/pages/dashboard/orders/Orders";

import UsersPage from "@/pages/dashboard/users/Users";
import CreateUserPage from "@/pages/dashboard/users/CreateUser";
import EditUserPage from "@/pages/dashboard/users/EditUser";

import Invoices from "@/pages/dashboard/invoices/Invoice";

import BrandsPage from "@/pages/dashboard/products/brands/Brands";
import CreateBrandPage from "@/pages/dashboard/products/brands/CreateBrand";
import EditBrandPage from "@/pages/dashboard/products/brands/EditBrand";

import CategoriesPage from "@/pages/dashboard/products/category/Categories";
import CreateCategoryPage from "@/pages/dashboard/products/category/CreateCategory";
import EditCategoryPage from "@/pages/dashboard/products/category/EditCategory";

import BannersPage from "@/pages/dashboard/products/banner/Banners";
import CreateBannerPage from "@/pages/dashboard/products/banner/CreateBanner";
import EditBannerPage from "@/pages/dashboard/products/banner/EditBanner";

// ================= PROTECTION =================
import { ProtectedRoute, PublicRoute, AdminRoute } from "@/routes/Protection";

// ======================================================
export const router = createBrowserRouter([
  // ================= PUBLIC =================
  {
    element: <PublicRoute />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },

  // ================= PROTECTED =================
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <App />,
        children: [
          // ================= DASHBOARD =================
          { index: true, element: <Dashboard /> },
          { path: "dashboard", element: <Dashboard /> },

          // ================= PRODUCTS =================
          {
            path: "dashboard/products",
            children: [
              { index: true, element: <ProductsPage /> },
              { path: "create", element: <CreateProductPage /> },
              { path: "edit/:id", element: <EditProductPage /> },
            ],
          },

          // ================= ORDERS =================
          { path: "dashboard/orders", element: <Orders /> },

          // ================= BRANDS =================
          {
            path: "dashboard/brands",
            children: [
              { index: true, element: <BrandsPage /> },
              { path: "create", element: <CreateBrandPage /> },
              { path: "edit/:id", element: <EditBrandPage /> },
            ],
          },

          // ================= CATEGORIES =================
          {
            path: "dashboard/categories",
            children: [
              { index: true, element: <CategoriesPage /> },
              { path: "create", element: <CreateCategoryPage /> },
              { path: "edit/:id", element: <EditCategoryPage /> },
            ],
          },

          // ================= BANNERS =================
          {
            path: "dashboard/banners",
            children: [
              { index: true, element: <BannersPage /> },
              { path: "create", element: <CreateBannerPage /> },
              { path: "edit/:id", element: <EditBannerPage /> },
            ],
          },

          // ================= ADMIN =================
          {
            element: <AdminRoute />,
            children: [
              {
                path: "dashboard/users",
                children: [
                  { index: true, element: <UsersPage /> },
                  { path: "create", element: <CreateUserPage /> },
                  { path: "edit/:userId", element: <EditUserPage /> },
                ],
              },

              { path: "dashboard/invoices", element: <Invoices /> },
            ],
          },
        ],
      },
    ],
  },
]);
