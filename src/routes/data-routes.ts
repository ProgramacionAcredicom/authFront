import { type LucideIcon, Building, Group, HomeIcon, Users2 } from "lucide-react";

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
      items: [
        {
          title: "Colaboradores",
          url: "/colaboradores",
        },
      ],
    },
    {
      title: "Agencias",
      url: "/agencias",
      icon: Building,
      items: [
        {
          title: "Gestionar agencias",
          url: "/agencias",
        },
      ],
    },
    {
      title: "Áreas",
      url: "/areas",
      icon: Building,
      items: [
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
      items: [
        {
          title: "Aplicativos",
          url: "/aplicativos",
        },
      ],
    },
  ],
};
