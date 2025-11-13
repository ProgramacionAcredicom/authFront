import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { UsersByAgency } from "@/interfaces/statistics.interfaces";
import { Building2, Users } from "lucide-react";
import { TypographyP, TypographySmall } from "@/components/ui/typography";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface UsersByAgencyProps {
  agencies: UsersByAgency[];
  totalUsers: number;
}

// Colores para las barras de progreso con mejor contraste
const colors = [
  { bg: "bg-blue-500", hover: "bg-blue-600" },
  { bg: "bg-green-500", hover: "bg-green-600" },
  { bg: "bg-purple-500", hover: "bg-purple-600" },
  { bg: "bg-orange-500", hover: "bg-orange-600" },
  { bg: "bg-pink-500", hover: "bg-pink-600" },
  { bg: "bg-cyan-500", hover: "bg-cyan-600" },
  { bg: "bg-yellow-500", hover: "bg-yellow-600" },
  { bg: "bg-indigo-500", hover: "bg-indigo-600" },
];

export const UsersByAgencyChart = ({ agencies, totalUsers }: UsersByAgencyProps) => {
  if (agencies.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/40">
              <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            Usuarios por Agencia
          </CardTitle>
          <CardDescription>Distribución de usuarios por agencia</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-32 flex-col items-center justify-center gap-2 text-muted-foreground">
            <Building2 className="h-8 w-8 opacity-50" />
            <TypographyP text="No hay datos disponibles" className="text-sm" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Ordenar agencias por cantidad de usuarios (descendente)
  const sortedAgencies = [...agencies].sort((a, b) => b.user_count - a.user_count);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/40">
              <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle>Usuarios por Agencia</CardTitle>
          </div>
          <Badge variant="secondary" className="font-semibold">
            {agencies.length}
          </Badge>
        </div>
        <CardDescription>
          Distribución de {totalUsers.toLocaleString()} usuarios en {agencies.length} agencias
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider delayDuration={300}>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {sortedAgencies.map((agency, index) => {
                const percentage = totalUsers > 0 ? (agency.user_count / totalUsers) * 100 : 0;
                const color = colors[index % colors.length];
                const rank = index + 1;
                const searchUrl = `/colaboradores?page=1&search=${encodeURIComponent(agency.agency_name)}`;

                return (
                  <Tooltip key={agency.agency_id}>
                    <TooltipTrigger asChild>
                      <Link to={searchUrl} className="block">
                        <div className="group space-y-2.5 rounded-lg border bg-card p-3 transition-all duration-200 hover:border-primary/50 hover:bg-accent/30 hover:shadow-sm cursor-pointer">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex flex-1 items-center gap-3 min-w-0">
                              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                                {rank}
                              </div>
                              <div className="flex-1 min-w-0">
                                <TypographyP
                                  text={agency.agency_name}
                                  className="truncate font-semibold text-sm leading-tight"
                                />
                                <div className="flex items-center gap-2 mt-1">
                                  <TypographySmall
                                    text={`${agency.user_count.toLocaleString()} usuarios`}
                                    className="text-xs text-muted-foreground flex items-center gap-1"
                                  />
                                  <Users className="h-3 w-3 text-muted-foreground" />
                                </div>
                              </div>
                            </div>
                            <div className="flex shrink-0 items-center gap-2">
                              <Badge variant="outline" className="font-semibold text-xs min-w-[3.5rem] justify-center">
                                {percentage.toFixed(1)}%
                              </Badge>
                            </div>
                          </div>
                          <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted">
                            <div
                              className={cn(
                                "h-full transition-all duration-700 ease-out group-hover:scale-y-110",
                                color.bg,
                                color.hover,
                              )}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="max-w-xs">
                      <div className="space-y-1">
                        <p className="font-semibold">{agency.agency_name}</p>
                        <p className="text-xs">
                          {agency.user_count.toLocaleString()} de {totalUsers.toLocaleString()} usuarios ({percentage.toFixed(1)}%)
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">Haz clic para ver colaboradores</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </ScrollArea>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};

