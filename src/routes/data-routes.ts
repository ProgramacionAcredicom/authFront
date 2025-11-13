import { type LucideIcon, Building, Group, HomeIcon, Users2, Briefcase } from "lucide-react";

interface Props {
  navMain: {
    title: string;
    url: string;
    icon: LucideIcon;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}

export const dataRoutes: Props = {
  navMain: [
    {
      title: "Inicio",
      icon: HomeIcon,
      url: "/",
    },
    {
      title: "Colaboradores",
      url: "/colaboradores",
      icon: Users2,
    },
    {
      title: "Unidades de trabajo",
      url: "/agencias",
      icon: Briefcase,
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
    },
  ],
};
