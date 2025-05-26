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

interface NavMenuProps {
  label: string;
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
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

export const NavMenu = ({ items, label }: NavMenuProps) => (
  <SidebarGroup>
    <SidebarGroupLabel>{label}</SidebarGroupLabel>
    <SidebarMenu>
      {items.map((item) =>
        item.items?.length ? (
          <SidebarMenuItemWithChildren key={item.title} item={item} />
        ) : (
          <SidebarMenuItemSimple key={item.title} item={item} />
        ),
      )}
    </SidebarMenu>
  </SidebarGroup>
);
