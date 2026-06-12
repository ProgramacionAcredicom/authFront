import { useState } from "react";
import { Briefcase, CheckCircle2, Edit, Power, XCircle } from "lucide-react";

import { useMutationEliminarPuesto } from "@/hooks/puestos/useMutationPuestos";
import { PuestoListItem } from "@/interfaces/puestos.interfaces";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TypographyH3, TypographyMuted } from "@/components/ui/typography";

interface CardPuestoProps {
  puesto: PuestoListItem;
  onEdit: (puestoId: number) => void;
  canEdit?: boolean;
  canDeactivate?: boolean;
}

export const CardPuesto = ({ puesto, onEdit, canEdit = true, canDeactivate = true }: CardPuestoProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { mutationEliminarPuesto, isLoading } = useMutationEliminarPuesto();
  const isActive = puesto.state;

  return (
    <>
      <Card
        className={cn(
          "group relative flex flex-col transition-all duration-200 hover:scale-[1.02] hover:shadow-lg",
          !isActive && "border-dashed opacity-60 grayscale",
        )}
      >
        <CardHeader className="flex flex-row items-start justify-between pb-3">
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <TypographyMuted text={`Total ${puesto.gruposCount}`} className="text-xs font-medium" />
              <Badge
                variant={isActive ? "default" : "outline"}
                className={cn(
                  "h-5 px-1.5 text-xs",
                  isActive
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
                )}
              >
                {isActive ? (
                  <>
                    <CheckCircle2 className="mr-1 size-3" />
                    Activo
                  </>
                ) : (
                  <>
                    <XCircle className="mr-1 size-3" />
                    Inactivo
                  </>
                )}
              </Badge>
            </div>
            <TypographyH3 text={puesto.role} className="truncate text-lg font-semibold transition-colors group-hover:text-primary" />
          </div>

          {isActive && canDeactivate ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => setShowDeleteDialog(true)}
                    disabled={isLoading}
                    aria-label={`Desactivar puesto ${puesto.role}`}
                  >
                    <Power className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Desactivar puesto</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : null}
        </CardHeader>

        <CardContent className="flex flex-1 flex-col justify-between gap-4 pt-0">
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <Briefcase className="size-4" />
              </div>
              <div className="min-w-0 flex items-end gap-1">
                <p className="text-sm font-medium">Cantidad:</p>
                <p className="text-sm text-muted-foreground">{puesto.gruposCount}</p>
              </div>
            </div>
          </div>

          {canEdit ? (
            <Button variant="outline" className="w-full transition-colors group-hover:border-primary group-hover:text-primary" size="sm" onClick={() => onEdit(puesto.id)}>
              <Edit className="mr-2 size-4" />
              Editar puesto
            </Button>
          ) : null}
        </CardContent>
      </Card>

      <AlertDialog open={canDeactivate ? showDeleteDialog : false} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Desactivar puesto?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas desactivar el puesto "{puesto.role}"? Podrás volver a activarlo más adelante desde backend si aplica.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                mutationEliminarPuesto.mutate({ id: String(puesto.id) });
                setShowDeleteDialog(false);
              }}
              disabled={isLoading}
              type="button"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? "Desactivando..." : "Desactivar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
