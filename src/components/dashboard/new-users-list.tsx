import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { NewUser } from "@/interfaces/statistics.interfaces";
import { UserPlus, Building2, Briefcase } from "lucide-react";
import { TypographyP, TypographySmall } from "@/components/ui/typography";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NewUsersListProps {
  users: NewUser[];
}

const getInitials = (fullName: string): string => {
  if (!fullName) return "U";
  return fullName
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

export const NewUsersList = ({ users }: NewUsersListProps) => {
  if (users.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/40">
              <UserPlus className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            Nuevos Usuarios este Mes
          </CardTitle>
          <CardDescription>Usuarios registrados en el mes actual</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-32 flex-col items-center justify-center gap-2 text-muted-foreground">
            <UserPlus className="h-8 w-8 opacity-50" />
            <TypographyP text="No hay nuevos usuarios este mes" className="text-sm" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/40">
              <UserPlus className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <CardTitle>Nuevos Usuarios este Mes</CardTitle>
          </div>
          <Badge variant="secondary" className="font-semibold">
            {users.length}
          </Badge>
        </div>
        <CardDescription>Usuarios registrados en el mes actual</CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider delayDuration={300}>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {users.map((user, index) => (
                <div key={user.id}>
                  <Link
                    to={`/colaboradores/editar/${user.id}`}
                    className="block"
                  >
                    <div
                      className={cn(
                        "group flex items-start gap-4 rounded-lg border bg-card p-4 transition-all duration-200",
                        "hover:border-primary/50 hover:bg-accent/50 hover:shadow-sm cursor-pointer"
                      )}
                    >
                      <Avatar className="h-14 w-14 shrink-0 border-2 border-background ring-2 ring-primary/10 transition-all group-hover:ring-primary/20">
                        {user.picture ? (
                          <AvatarImage src={user.picture} alt={user.name} />
                        ) : (
                          <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-purple-100 to-purple-200 text-purple-700 dark:from-purple-900/40 dark:to-purple-800/40 dark:text-purple-300">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex flex-1 flex-col gap-2 min-w-0">
                        <TypographyP
                          text={user.name}
                          className="truncate font-semibold leading-tight"
                        />
                        <div className="flex flex-wrap items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="outline" className="text-xs gap-1.5 max-w-full" onClick={(e) => e.stopPropagation()}>
                                <Building2 className="h-3 w-3 shrink-0" />
                                <span className="truncate">{user.agency.name}</span>
                              </Badge>
                            </TooltipTrigger>
                            {user.agency.name.length > 15 && (
                              <TooltipContent>
                                <p className="max-w-xs break-words">{user.agency.name}</p>
                              </TooltipContent>
                            )}
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="outline" className="text-xs gap-1.5 max-w-full" onClick={(e) => e.stopPropagation()}>
                                <Briefcase className="h-3 w-3 shrink-0" />
                                <span className="break-words whitespace-normal">{user.role.role}</span>
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-xs">
                              <p className="break-words">{user.role.role}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </Link>
                  {index < users.length - 1 && (
                    <Separator className="my-3" />
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};

