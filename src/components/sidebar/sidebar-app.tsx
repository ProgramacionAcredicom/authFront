import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, useSidebar } from "@/components/ui/sidebar";
import logoAcredicomAzulHorizontal from "@/assets/img/Logo_acredicom_azul_horizontal.webp";
import logoAcredicomIcon from "/img/Logo_Acredicom_icon.ico";
import { NavUser } from "@/components/sidebar/nav-user";
import { useIsMobile } from "@/hooks/use-mobile";
import { NavMenu } from "@/components/sidebar/nav-menu";
import { useTheme } from "../theme /theme-provider";
import { dataRoutes } from "@/routes/data-routes";

export const SidebarApp = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="py-4">
        {open ? (
          theme === "dark" ? (
            <img src={logoAcredicomAzulHorizontal} alt="Logo Acredicom" className="m-auto h-auto w-3/4" />
          ) : (
            <img src={logoAcredicomAzulHorizontal} alt="Logo Acredicom" className="m-auto h-auto w-3/4" />
          )
        ) : (
          <img src={logoAcredicomIcon} alt="Logo Acredicom" className="m-auto size-8" />
        )}
      </SidebarHeader>
      <SidebarContent>
        <NavMenu items={dataRoutes.navMain} label="Menu" />
      </SidebarContent>
      {isMobile && (
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      )}
    </Sidebar>
  );
};
