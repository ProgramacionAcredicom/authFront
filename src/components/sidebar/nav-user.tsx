import { ChevronsUpDown, LogOut } from "lucide-react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuth.store";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/services/auth/auth.services";
import { splitName } from "@/lib/splitName";

export const NavUser = () => {
  const logout = useAuthStore((state) => state.logout);

  const { data: user } = useQuery({
    queryKey: ["info_user"],
    queryFn: getProfile,
    staleTime: 1000 * 60 * 60,
  });

  const { name, lastName } = splitName(user?.name || "");

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Avatar className="size-10 rounded-full">
                {user?.picture && <AvatarImage src={user.picture} alt={`Foto de perfil ${user?.name}`} />}
                <AvatarFallback className="rounded-lg">{user?.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="text-custom-gray truncate font-bold">
                  {name} {lastName}
                </span>
                <span className="text-custom-gray/75 truncate text-xs">{user?.role?.role}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-56 rounded-lg"
            side="bottom"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuItem onClick={() => logout()} className="cursor-pointer">
              <LogOut />
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
