import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX, UserPlus } from "lucide-react";
import { StatisticsResponse } from "@/interfaces/statistics.interfaces";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StatisticsCardsProps {
  data: StatisticsResponse;
}

export const StatisticsCards = ({ data }: StatisticsCardsProps) => {
  const activePercentage = data.total_users > 0 
    ? ((data.active_users / data.total_users) * 100).toFixed(1) 
    : "0";
  
  const inactivePercentage = data.total_users > 0 
    ? ((data.inactive_users / data.total_users) * 100).toFixed(1) 
    : "0";

  const cards = [
    {
      title: "Total de Usuarios",
      value: data.total_users,
      icon: Users,
      bgClassName: "bg-blue-50 dark:bg-blue-950/20",
      borderClassName: "border-blue-200 dark:border-blue-800",
      iconClassName: "text-blue-600 dark:text-blue-400",
      iconBgClassName: "bg-blue-100 dark:bg-blue-900/40",
      description: "Total de usuarios registrados en el sistema",
    },
    {
      title: "Usuarios Activos",
      value: data.active_users,
      icon: UserCheck,
      bgClassName: "bg-green-50 dark:bg-green-950/20",
      borderClassName: "border-green-200 dark:border-green-800",
      iconClassName: "text-green-600 dark:text-green-400",
      iconBgClassName: "bg-green-100 dark:bg-green-900/40",
      description: `${activePercentage}% del total de usuarios`,
      percentage: activePercentage,
    },
    {
      title: "Usuarios Inactivos",
      value: data.inactive_users,
      icon: UserX,
      bgClassName: "bg-red-50 dark:bg-red-950/20",
      borderClassName: "border-red-200 dark:border-red-800",
      iconClassName: "text-red-600 dark:text-red-400",
      iconBgClassName: "bg-red-100 dark:bg-red-900/40",
      description: `${inactivePercentage}% del total de usuarios`,
      percentage: inactivePercentage,
    },
    {
      title: "Nuevos este Mes",
      value: data.new_users_this_month.length,
      icon: UserPlus,
      bgClassName: "bg-purple-50 dark:bg-purple-950/20",
      borderClassName: "border-purple-200 dark:border-purple-800",
      iconClassName: "text-purple-600 dark:text-purple-400",
      iconBgClassName: "bg-purple-100 dark:bg-purple-900/40",
      description: "Usuarios registrados en el mes actual",
    },
  ];

  return (
    <TooltipProvider delayDuration={300}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Tooltip key={card.title}>
              <TooltipTrigger asChild>
                <Card
                  className={cn(
                    "group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                    card.bgClassName,
                    card.borderClassName,
                  )}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-semibold leading-tight">
                      {card.title}
                    </CardTitle>
                    <div className={cn(
                      "rounded-lg p-2 transition-colors group-hover:scale-110",
                      card.iconBgClassName
                    )}>
                      <Icon className={cn("h-5 w-5", card.iconClassName)} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <div className="text-3xl font-bold tracking-tight">
                      {card.value.toLocaleString()}
                    </div>
                    {card.percentage && (
                      <p className="text-xs text-muted-foreground">
                        {card.percentage}% del total
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="text-sm">{card.description}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
};

