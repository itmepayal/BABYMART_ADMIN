import { createBrowserRouter } from "react-router-dom";
import App from "@/App";

import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

import Dashboard from "@/pages/dashboard/Dashboard";
import Products from "@/pages/dashboard/products/Products";
import Orders from "@/pages/dashboard/orders/Orders";

import UsersPage from "@/pages/dashboard/users/Users";
import CreateUserPage from "@/pages/dashboard/users/CreateUser";
import EditUserPage from "@/pages/dashboard/users/EditUser";

import Invoices from "@/pages/dashboard/invoices/Invoice";

import Brands from "@/pages/dashboard/products/brands/Brands";
import CreateBrandPage from "@/pages/dashboard/products/brands/CreateBrand";
import EditBrandPage from "@/pages/dashboard/products/brands/EditBrand";

import CategoriesPage from "@/pages/dashboard/products/category/Categories";
import CreateCategoryPage from "@/pages/dashboard/products/category/CreateCategory";
import EditCategoryPage from "@/pages/dashboard/products/category/EditCategory";

import Banners from "@/pages/dashboard/products/Banners";
import Categories from "@/pages/dashboard/products/Categories";

import { ProtectedRoute, PublicRoute, AdminRoute } from "@/routes/Protection";

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <App />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "/dashboard", element: <Dashboard /> },

          // ================= PRODUCTS =================
          { path: "/dashboard/products", element: <Products /> },
          { path: "/dashboard/orders", element: <Orders /> },

          // ================= PRODUCTS META =================
          { path: "/dashboard/brands", element: <Brands /> },
          { path: "/dashboard/brands/create", element: <CreateBrandPage /> },
          { path: "/dashboard/brands/edit/:id", element: <EditBrandPage /> },
          // ================= PRODUCTS META =================
          { path: "/dashboard/categories", element: <CategoriesPage /> },
          {
            path: "/dashboard/categories/create",
            element: <CreateCategoryPage />,
          },
          {
            path: "/dashboard/categories/edit/:id",
            element: <EditCategoryPage />,
          },
          { path: "/dashboard/banners", element: <Banners /> },
          { path: "/dashboard/categories", element: <Categories /> },

          // ================= ADMIN ONLY =================
          {
            element: <AdminRoute />,
            children: [
              { path: "/dashboard/users", element: <UsersPage /> },
              { path: "/dashboard/users/create", element: <CreateUserPage /> },
              {
                path: "/dashboard/users/edit/:userId",
                element: <EditUserPage />,
              },
              { path: "/dashboard/invoices", element: <Invoices /> },
            ],
          },
        ],
      },
    ],
  },
]);
