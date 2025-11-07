import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TypographyH3, TypographyMuted } from "@/components/ui/typography";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { GruposTypeModel } from "@/interfaces/grupos.interfaces";
import { Edit, Users } from "lucide-react";
import { Link } from "react-router-dom";

interface CardGruposProps {
  grupo: GruposTypeModel;
}

export const CardGrupos = ({ grupo }: CardGruposProps) => {
  const { nombre, users = [], aplicativos = [], id } = grupo;
  const totalUsers = users.length;
  const visibleUsers = users.slice(0, 3);
  const remainingUsers = totalUsers - visibleUsers.length;

  return (
    <Card className="relative flex flex-col transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between pb-3">
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <TypographyMuted 
            text={`Total ${totalUsers} ${totalUsers === 1 ? "usuario" : "usuarios"}`}
            className="text-xs font-medium text-muted-foreground"
          />
          <TypographyH3 text={nombre} className="text-lg font-semibold truncate" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 pt-0">
        <TooltipProvider delayDuration={200}>
          <div className="flex items-center gap-2">
            {visibleUsers.length > 0 ? (
              <>
                <div className="flex -space-x-2">
                  {visibleUsers.map((user) => (
                    <Tooltip key={user.id}>
                      <TooltipTrigger asChild>
                        <Link
                          to={`/colaboradores/editar/${user.id}`}
                          className="relative cursor-pointer transition-all duration-200 hover:scale-110 hover:z-10 block"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Avatar
                            className={`h-10 w-10 border border-gray-300 dark:border-gray-600 transition-shadow duration-200 hover:shadow-md ${
                              !user.is_active ? "opacity-50" : ""
                            }`}
                          >
                            {user.picture ? (
                              <AvatarImage src={user.picture} alt={user.name} />
                            ) : (
                              <AvatarFallback className="text-xs border border-gray-300 dark:border-gray-600">
                                {user.name
                                  ? user.name
                                      .split(" ")
                                      .slice(0, 2)
                                      .map((n) => n[0])
                                      .join("")
                                      .toUpperCase()
                                  : "U"}
                              </AvatarFallback>
                            )}
                          </Avatar>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{user.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
                {remainingUsers > 0 && (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                    +{remainingUsers}
                  </div>
                )}
              </>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/30 bg-muted/50">
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
          </div>
        </TooltipProvider>
        {aplicativos.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {aplicativos.map((aplicativo) => (
              <Badge key={aplicativo.id} variant="secondary">
                {aplicativo.nombre}
              </Badge>
            ))}
          </div>
        )}
        <Link to={`editar/${id}`} state={{ modal: true }}>
          <Button variant="outline" className="w-full" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Editar Grupo
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

