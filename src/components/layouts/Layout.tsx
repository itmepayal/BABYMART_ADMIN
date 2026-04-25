import { Outlet } from "react-router-dom";
import { Sidebar } from "./sidebar/Sidebar";
import { Header } from "./header/Header";

export const Layout = () => {
  return (
    <div className="flex h-screen font-sans bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
