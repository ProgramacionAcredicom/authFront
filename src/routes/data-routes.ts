import { type LucideIcon, Group, HomeIcon, KeyRound, Users2, Briefcase, User } from "lucide-react";

interface Props {
  navMain: {
    title: string;
    url: string;
    icon: LucideIcon;
    requiresStaff?: boolean; // Si es true, solo se muestra para usuarios staff
    items?: {
      title: string;
      url: string;
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
      title: "Mi Acceso",
      icon: KeyRound,
      url: "/mi-acceso",
      requiresStaff: true,
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
