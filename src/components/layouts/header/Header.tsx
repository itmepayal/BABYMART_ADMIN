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

import { useAuthStore } from "@/store/auth/useAuthStore";
import { useLogout } from "@/hooks/useLogout";
import { toast } from "sonner";

export const Header = () => {
  const navigate = useNavigate();
  const { handleLogout, loading } = useLogout();
  const { user } = useAuthStore();
  const fullName = `${user?.firstname || ""} ${user?.lastname || ""}`.trim();
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
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-emerald-100 shadow-sm sticky top-0 z-50">
      <div className="h-full flex items-center justify-between px-6">
        <div className="flex flex-col justify-center gap-0.5">
          <h1 className="text-base font-semibold text-gray-800 leading-tight">
            Dashboard
          </h1>
          <p className="text-xs text-muted-foreground">
            Welcome back,{" "}
            <span className="font-medium bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
              {user?.firstname || "User"}
            </span>{" "}
            👋
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full w-9 h-9 hover:bg-emerald-50 transition-all hover:scale-105"
          >
            <Bell className="w-4.5 h-4.5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-ping opacity-75" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </Button>

          <div className="h-6 w-px bg-gray-200" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full border border-emerald-100 bg-gradient-to-r from-emerald-50 to-cyan-50 hover:from-emerald-100 hover:to-cyan-100 hover:border-emerald-200 transition-all hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400">
                <div className="relative">
                  <Avatar className="h-7 w-7">
                    {avatarUrl ? (
                      <AvatarImage src={avatarUrl} />
                    ) : (
                      <AvatarFallback className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white text-xs font-semibold">
                        {initials || "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 border-2 border-white rounded-full" />
                </div>

                <span className="text-xs font-semibold capitalize bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                  {role}
                </span>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-64 p-2 rounded-2xl shadow-xl border border-emerald-100 bg-white animate-in fade-in zoom-in-95"
            >
              <DropdownMenuLabel className="px-2 py-2 rounded-xl bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 mb-1">
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <Avatar className="h-10 w-10 ring-2 ring-white ring-offset-1 ring-offset-emerald-100">
                      {avatarUrl ? (
                        <AvatarImage src={avatarUrl} />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white font-semibold">
                          {initials || "U"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                  </div>

                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-gray-800 truncate">
                      {fullName || "User"}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      {email}
                    </span>
                    <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                      {role}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator className="bg-emerald-50" />

              <DropdownMenuItem
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2.5 text-sm rounded-lg px-2 py-2 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer transition-colors"
              >
                <div className="w-7 h-7 rounded-md bg-emerald-100 flex items-center justify-center shrink-0">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-sm">Profile</span>
                  <span className="text-xs text-muted-foreground">
                    View your public profile
                  </span>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => navigate("/settings")}
                className="flex items-center gap-2.5 text-sm rounded-lg px-2 py-2 hover:bg-teal-50 hover:text-teal-700 cursor-pointer transition-colors"
              >
                <div className="w-7 h-7 rounded-md bg-teal-100 flex items-center justify-center shrink-0">
                  <Settings className="w-3.5 h-3.5 text-teal-600" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-sm">Settings</span>
                  <span className="text-xs text-muted-foreground">
                    Manage preferences
                  </span>
                </div>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-emerald-50 my-1" />

              <DropdownMenuItem
                onClick={onSubmit}
                disabled={loading}
                className="flex items-center gap-2.5 text-sm rounded-lg px-2 py-2
                  text-red-500
                  hover:bg-red-50 hover:text-red-600
                  focus:bg-red-50 focus:text-red-600
                  data-[highlighted]:bg-red-50 data-[highlighted]:text-red-600
                  cursor-pointer transition-colors disabled:opacity-50"
              >
                <div className="w-7 h-7 rounded-md bg-red-50 flex items-center justify-center shrink-0">
                  <LogOut className="w-3.5 h-3.5 text-red-500" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-sm">
                    {loading ? "Logging out..." : "Logout"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Sign out of your account
                  </span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
