import { useState } from "react";
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

import { NavLink, useLocation } from "react-router-dom";
import type { OAuthPermission } from "@/lib/permissions";
import { hasAccess } from "@/lib/permissions";
import { useInfoUserQuery } from "@/hooks/auth/usePermissionAccess";

interface NavMenuProps {
  label: string;
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    requiresStaff?: boolean;
    requiredPermission?: OAuthPermission;
    items?: {
      title: string;
      url: string;
      requiresStaff?: boolean;
      requiredPermission?: OAuthPermission;
    }[];
  }[];
}
type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  requiresStaff?: boolean;
  requiredPermission?: OAuthPermission;
  items?: NavItem[]; // Recursivo para menús anidados
};
const getNavLinkClass = (isActive: boolean): string =>
  `py-4 ${
    isActive
      ? "[&>span]:bg-custom-gray/90 [&>span]:text-primary-foreground hover:[&>span]:bg-custom-gray hover:[&>span]:text-primary-foreground dark:[&>span]:text-white"
      : ""
  }`;
const isPathActive = (pathname: string, url: string) => pathname === url || pathname.startsWith(`${url}/`);

const hasActiveChild = (item: NavItem, pathname: string): boolean =>
  item.items?.some((child) => isPathActive(pathname, child.url) || hasActiveChild(child, pathname)) ?? false;

const SidebarMenuItemWithChildren = ({
  item,
  pathname,
  isOpen,
  onOpenChange,
}: {
  item: NavItem;
  pathname: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) => (
  <Collapsible className="group/collapsible" open={isOpen} onOpenChange={onOpenChange}>
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
                <SidebarMenuSubButton asChild isActive={isPathActive(pathname, subItem.url)}>
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
  const { data: user } = useInfoUserQuery();
  const { pathname } = useLocation();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const filterItems = (menuItems: NavItem[]): NavItem[] =>
    menuItems.reduce<NavItem[]>((acc, item) => {
      if (item.requiresStaff && !user?.is_staff) {
        return acc;
      }

      if (item.requiredPermission && !hasAccess(user, item.requiredPermission)) {
        return acc;
      }

      const filteredChildren = item.items?.length ? filterItems(item.items) : item.items;

      if (item.items?.length && (!filteredChildren || filteredChildren.length === 0)) {
        return acc;
      }

      acc.push({
        ...item,
        items: filteredChildren,
      });

      return acc;
    }, []);

  const filteredItems = filterItems(items);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {filteredItems.map((item) => {
          if (item.items?.length) {
            const keepOpenByRoute = hasActiveChild(item, pathname);
            const isOpen = keepOpenByRoute || !!openGroups[item.title];

            return (
              <SidebarMenuItemWithChildren
                key={item.title}
                item={item}
                pathname={pathname}
                isOpen={isOpen}
                onOpenChange={(open) =>
                  setOpenGroups((previous) => ({
                    ...previous,
                    [item.title]: open,
                  }))
                }
              />
            );
          }

          return <SidebarMenuItemSimple key={item.title} item={item} />;
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
};
