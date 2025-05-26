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
          url: "/agencias/agencias",
        },
      ],
    },

    {
      title: "Grupos y permisos",
      url: "/grupos-permisos",
      icon: Group,
      items: [
        {
          title: "Gestionar grupos & permisos",
          url: "/grupos-permisos/grupos",
        },
        {
          title: "Aplicativos",
          url: "/grupos-permisos/aplicativos",
        },
      ],
    },
  ],
};
