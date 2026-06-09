import { createBrowserRouter } from "react-router-dom";

import App from "@/App";

// ======================================================
// AUTH PAGES
// ======================================================
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

// ======================================================
// DASHBOARD PAGES
// ======================================================
import Dashboard from "@/pages/dashboard/Dashboard";

// ======================================================
// PRODUCT MODULE
// ======================================================
import ProductsPage from "@/pages/dashboard/products/product/Products";
import CreateProductPage from "@/pages/dashboard/products/product/CreateProduct";
import EditProductPage from "@/pages/dashboard/products/product/EditProduct";

// ======================================================
// ORDER MODULE
// ======================================================
import OrdersPage from "@/pages/dashboard/orders/Orders";
import CreateOrderPage from "@/pages/dashboard/orders/CreateOrder";
import EditOrderPage from "@/pages/dashboard/orders/EditOrder";

// ======================================================
// USER MODULE
// ======================================================
import UsersPage from "@/pages/dashboard/users/Users";
import CreateUserPage from "@/pages/dashboard/users/CreateUser";
import EditUserPage from "@/pages/dashboard/users/EditUser";

// ======================================================
// INVOICE MODULE
// ======================================================
import Invoices from "@/pages/dashboard/invoices/Invoice";

// ======================================================
// BRAND MODULE
// ======================================================
import BrandsPage from "@/pages/dashboard/products/brands/Brands";
import CreateBrandPage from "@/pages/dashboard/products/brands/CreateBrand";
import EditBrandPage from "@/pages/dashboard/products/brands/EditBrand";

// ======================================================
// CATEGORY MODULE
// ======================================================
import CategoriesPage from "@/pages/dashboard/products/category/Categories";
import CreateCategoryPage from "@/pages/dashboard/products/category/CreateCategory";
import EditCategoryPage from "@/pages/dashboard/products/category/EditCategory";

// ======================================================
// BANNER MODULE
// ======================================================
import BannersPage from "@/pages/dashboard/products/banner/Banners";
import CreateBannerPage from "@/pages/dashboard/products/banner/CreateBanner";
import EditBannerPage from "@/pages/dashboard/products/banner/EditBanner";

// ======================================================
// ROUTE PROTECTION
// ======================================================
import { ProtectedRoute, PublicRoute, AdminRoute } from "@/routes/Protection";

// ======================================================
// ROUTER CONFIGURATION
// ======================================================
export const router = createBrowserRouter([
  // ======================================================
  // PUBLIC ROUTES
  // Accessible without authentication
  // ======================================================
  {
    element: <PublicRoute />,

    children: [
      {
        path: "/login",
        element: <Login />,
      },

      {
        path: "/register",
        element: <Register />,
      },
    ],
  },

  // ======================================================
  // PROTECTED ROUTES
  // Requires authenticated user
  // ======================================================
  {
    element: <ProtectedRoute />,

    children: [
      {
        path: "/",
        element: <App />,

        children: [
          // ======================================================
          // DASHBOARD
          // ======================================================
          {
            index: true,
            element: <Dashboard />,
          },

          {
            path: "dashboard",
            element: <Dashboard />,
          },

          // ======================================================
          // PRODUCT ROUTES
          // ======================================================
          {
            path: "dashboard/products",

            children: [
              // GET ALL PRODUCTS
              {
                index: true,
                element: <ProductsPage />,
              },

              // CREATE PRODUCT
              {
                path: "create",
                element: <CreateProductPage />,
              },

              // EDIT PRODUCT
              {
                path: "edit/:id",
                element: <EditProductPage />,
              },
            ],
          },

          // ======================================================
          // ORDER ROUTES
          // ======================================================
          {
            path: "dashboard/orders",

            children: [
              // GET ALL ORDERS
              {
                index: true,
                element: <OrdersPage />,
              },

              // CREATE ORDER
              {
                path: "create",
                element: <CreateOrderPage />,
              },

              // EDIT ORDER
              {
                path: "edit/:id",
                element: <EditOrderPage />,
              },
            ],
          },

          // ======================================================
          // BRAND ROUTES
          // ======================================================
          {
            path: "dashboard/brands",

            children: [
              // GET ALL BRANDS
              {
                index: true,
                element: <BrandsPage />,
              },

              // CREATE BRAND
              {
                path: "create",
                element: <CreateBrandPage />,
              },

              // EDIT BRAND
              {
                path: "edit/:id",
                element: <EditBrandPage />,
              },
            ],
          },

          // ======================================================
          // CATEGORY ROUTES
          // ======================================================
          {
            path: "dashboard/categories",

            children: [
              // GET ALL CATEGORIES
              {
                index: true,
                element: <CategoriesPage />,
              },

              // CREATE CATEGORY
              {
                path: "create",
                element: <CreateCategoryPage />,
              },

              // EDIT CATEGORY
              {
                path: "edit/:id",
                element: <EditCategoryPage />,
              },
            ],
          },

          // ======================================================
          // BANNER ROUTES
          // ======================================================
          {
            path: "dashboard/banners",

            children: [
              // GET ALL BANNERS
              {
                index: true,
                element: <BannersPage />,
              },

              // CREATE BANNER
              {
                path: "create",
                element: <CreateBannerPage />,
              },

              // EDIT BANNER
              {
                path: "edit/:id",
                element: <EditBannerPage />,
              },
            ],
          },

          // ======================================================
          // ADMIN ONLY ROUTES
          // Accessible only by admin users
          // ======================================================
          {
            element: <AdminRoute />,

            children: [
              // ======================================================
              // USER MANAGEMENT
              // ======================================================
              {
                path: "dashboard/users",

                children: [
                  // GET ALL USERS
                  {
                    index: true,
                    element: <UsersPage />,
                  },

                  // CREATE USER
                  {
                    path: "create",
                    element: <CreateUserPage />,
                  },

                  // EDIT USER
                  {
                    path: "edit/:userId",
                    element: <EditUserPage />,
                  },
                ],
              },

              // ======================================================
              // INVOICE MANAGEMENT
              // ======================================================
              {
                path: "dashboard/invoices",
                element: <Invoices />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
