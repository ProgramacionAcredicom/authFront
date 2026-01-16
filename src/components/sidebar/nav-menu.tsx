import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@radix-ui/react-collapsible";
import { ChevronRight, type LucideIcon } from "lucide-react";

import { NavLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/services/auth/auth.services";

interface NavMenuProps {
  label: string;
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    requiresStaff?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}
type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  requiresStaff?: boolean;
  items?: NavItem[]; // Recursivo para menús anidados
};
const getNavLinkClass = (isActive: boolean): string =>
  `py-4 ${
    isActive
      ? "[&>span]:bg-custom-gray/90 [&>span]:text-primary-foreground hover:[&>span]:bg-custom-gray hover:[&>span]:text-primary-foreground dark:[&>span]:text-white"
      : ""
  }`;
const SidebarMenuItemWithChildren = ({ item }: { item: NavItem }) => (
  <Collapsible className="group/collapsible">
    <SidebarMenuItem>
      <CollapsibleTrigger asChild>
        <SidebarMenuButton tooltip={item.title}>
          {item.icon && <item.icon />}
          <span>{item.title}</span>
          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
        </SidebarMenuButton>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub>
          {item.items?.map((subItem) => (
            <SidebarMenuSubItem key={subItem.title}>
              <NavLink to={subItem.url} className={({ isActive }) => getNavLinkClass(isActive)}>
                <SidebarMenuSubButton asChild>
                  <span>{subItem.title}</span>
                </SidebarMenuSubButton>
              </NavLink>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </SidebarMenuItem>
  </Collapsible>
);

const SidebarMenuItemSimple = ({ item }: { item: NavItem }) => (
  <SidebarMenuItem>
    <NavLink to={item.url} className={({ isActive }) => getNavLinkClass(isActive)}>
      <SidebarMenuButton tooltip={item.title} asChild>
        <span>
          {item.icon && <item.icon />}
          {item.title}
        </span>
      </SidebarMenuButton>
    </NavLink>
  </SidebarMenuItem>
);

export const NavMenu = ({ items, label }: NavMenuProps) => {
  // Obtener información del usuario para filtrar menú
  const { data: user } = useQuery({
    queryKey: ["info_user"],
    queryFn: getProfile,
    staleTime: 1000 * 60 * 60,
  });

  const isStaff = user?.is_staff || false;

  // Filtrar items basado en is_staff
  const filteredItems = items.filter((item) => {
    // Si requiere staff y el usuario no es staff, ocultar
    if (item.requiresStaff && !isStaff) {
      return false;
    }
    return true;
  });

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {filteredItems.map((item) =>
          item.items?.length ? (
            <SidebarMenuItemWithChildren key={item.title} item={item} />
          ) : (
            <SidebarMenuItemSimple key={item.title} item={item} />
          ),
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
};
