import { BreadcrumbDynamic } from "@/components/sidebar/breadCrumb-dynamic";
import { NavUser } from "@/components/sidebar/nav-user";
import { SidebarApp } from "@/components/sidebar/sidebar-app";
import { ThemeToggle } from "@/components/theme /theme-toggle";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebarStore } from "@/store/useSidebard.store";
import { Loader2 } from "lucide-react";
import { Outlet, useLocation, useNavigation } from "react-router-dom";

export default function LayoutAdmin() {
  const isMobile = useIsMobile();
  const open = useSidebarStore((state) => state.open);
  const setOpen = useSidebarStore((state) => state.setOpen);
  const navigation = useNavigation();
  const pathname = useLocation();
  const isExcludedPath = pathname.pathname.startsWith("/grupos-permisos/grupos/");
  const isNavigating = navigation.state === "loading" && !isExcludedPath;

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <SidebarApp />
      <SidebarInset>
        <header className="bg-background sticky top-0 z-50 flex items-center justify-between border-b pr-4">
          <div className="flex h-16 shrink-0 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbDynamic />
            </Breadcrumb>
          </div>
          <div className="flex items-center justify-center gap-4">
            {!isMobile && <NavUser />}
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {isNavigating ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="size-12 animate-spin" />
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
