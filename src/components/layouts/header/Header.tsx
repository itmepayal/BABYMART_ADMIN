import { Bell, LogOut, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

import { useAuthStore } from "@/store/auth/useAuthStore";
import { useLogout } from "@/hooks/useLogout";
import { toast } from "sonner";

export const Header = () => {
  const navigate = useNavigate();
  const { handleLogout, loading } = useLogout();
  const { user } = useAuthStore();
  const fullName = `${user?.firstname || ""} ${user?.lastname || ""}`;
  const email = user?.email || "";
  const role = user?.role || "User";

  const initials =
    (user?.firstname?.[0] ?? "").toUpperCase() +
    (user?.lastname?.[0] ?? "").toUpperCase();

  const avatarUrl = user?.avatar?.url;

  const onSubmit = async () => {
    try {
      await handleLogout();
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      toast.error("Failed to logout. Please try again.");
      console.log(error);
    }
  };

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b shadow-sm sticky top-0 z-50">
      <div className="h-full flex items-center justify-between px-6">
        {/* LEFT */}
        <div className="flex flex-col justify-center">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-base font-semibold text-gray-800">
                  Dashboard
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <span className="text-xs text-muted-foreground">
            Welcome back, {user?.firstname || "User"} 👋
          </span>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full hover:bg-muted transition hover:scale-105"
          >
            <Bell className="w-5 h-5 text-muted-foreground" />

            {/* Ping */}
            <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
            <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer pl-2 pr-3 py-1.5 rounded-full hover:bg-muted transition hover:scale-[1.03]">
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    {avatarUrl ? (
                      <AvatarImage src={avatarUrl} />
                    ) : (
                      <AvatarFallback className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white text-xs font-semibold">
                        {initials || "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>

                  {/* Online indicator */}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                </div>

                <span className="text-sm font-medium text-gray-700 capitalize">
                  {role}
                </span>
              </div>
            </DropdownMenuTrigger>

            {/* Dropdown */}
            <DropdownMenuContent
              align="end"
              className="w-60 p-2 rounded-xl shadow-xl border animate-in fade-in zoom-in-95"
            >
              {/* USER INFO */}
              <DropdownMenuLabel className="flex items-center gap-3 px-2 py-2">
                <Avatar className="h-10 w-10">
                  {avatarUrl ? (
                    <AvatarImage src={avatarUrl} />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white">
                      {initials || "U"}
                    </AvatarFallback>
                  )}
                </Avatar>

                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{fullName}</span>
                  <span className="text-xs text-muted-foreground">{email}</span>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              {/* MENU */}
              <DropdownMenuItem
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2 text-sm rounded-md hover:bg-muted cursor-pointer"
              >
                <User className="w-4 h-4" />
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => navigate("/settings")}
                className="flex items-center gap-2 text-sm rounded-md hover:bg-muted cursor-pointer"
              >
                <Settings className="w-4 h-4" />
                Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* LOGOUT */}
              <DropdownMenuItem
                onClick={onSubmit}
                disabled={loading}
                className="flex items-center gap-2 text-sm font-medium text-red-500
  hover:bg-red-50 hover:text-red-600
  focus:bg-red-50 focus:text-red-600
  data-[highlighted]:bg-red-50 data-[highlighted]:text-red-600
  rounded-md cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-red-600" />

                {loading ? "Logging out..." : "Logout"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
