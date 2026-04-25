import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Dashboard from "@/pages/dashboard/Dashboard";
import Products from "@/pages/products/Products";
import Orders from "@/pages/orders/Orders";
import Users from "@/pages/users/Accounts";
import Invoices from "@/pages/invoices/Invoice";
import Brands from "@/pages/products/Brands";
import Banners from "@/pages/products/Banners";
import Categories from "@/pages/products/Categories";

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

          { path: "/dashboard/products", element: <Products /> },
          { path: "/dashboard/orders", element: <Orders /> },

          { path: "/dashboard/brands", element: <Brands /> },
          { path: "/dashboard/banners", element: <Banners /> },
          { path: "/dashboard/categories", element: <Categories /> },
          {
            element: <AdminRoute />,
            children: [
              { path: "/dashboard/users", element: <Users /> },
              { path: "/dashboard/invoices", element: <Invoices /> },
            ],
          },
        ],
      },
    ],
  },
]);
