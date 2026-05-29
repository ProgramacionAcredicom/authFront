import { type LucideIcon, Group, HomeIcon, Users2, Briefcase, User } from "lucide-react";
import type { OAuthPermission } from "@/lib/permissions";
import { OAUTH_PERMISSIONS } from "@/lib/permissions";

interface Props {
  navMain: {
    title: string;
    url: string;
    icon: LucideIcon;
    requiresStaff?: boolean; // Si es true, solo se muestra para usuarios staff
    requiredPermission?: OAuthPermission;
    items?: {
      title: string;
      url: string;
      requiresStaff?: boolean;
      requiredPermission?: OAuthPermission;
    }[];
  }[];
}

export const dataRoutes: Props = {
  navMain: [
    {
      title: "Mi perfil",
      icon: User,
      url: "/profile",
    },
    {
      title: "Inicio",
      icon: HomeIcon,
      url: "/",
      requiresStaff: true,
    },
    {
      title: "Talento Humano",
      icon: Users2,
      url: "/mi-acceso",
      items: [
        {
          title: "Movimientos",
          url: "/movimientos",
          requiredPermission: OAUTH_PERMISSIONS.MOVEMENTS_ACCESS,
        },
        {
          title: "Reporteria",
          url: "/reporteria",
          requiredPermission: OAUTH_PERMISSIONS.MOVEMENTS_REPORT_ACCESS,
        },
      ],
    },
    {
      title: "Colaboradores",
      url: "/colaboradores",
      icon: Users2,
      requiresStaff: true,
    },
    {
      title: "Unidades de trabajo",
      url: "/agencias",
      icon: Briefcase,
      requiresStaff: true,
      items: [
        {
          title: "Gestionar agencias",
          url: "/agencias",
        },
        {
          title: "Gestionar áreas",
          url: "/areas",
          requiresStaff: true,
        },
      ],
    },
    {
      title: "Gestión de grupos",
      url: "/grupos",
      icon: Group,
      requiresStaff: true,
      items: [
        {
          title: "Grupos",
          url: "/grupos",
        },
        {
          title: "Permisos",
          url: "/permisos",
        },
      ],
    },
    {
      title: "Aplicativos",
      url: "/aplicativos",
      icon: Group,
      requiresStaff: true,
    },
  ],
};
