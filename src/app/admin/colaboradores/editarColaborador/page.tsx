import { Title } from "@/components/title/Title";
import { FormColaborador } from "@/components/form/colaboradores/form-colaborador";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { GruposTypeModel } from "@/interfaces/grupos.interfaces";
import { ColaboradorListPanel } from "@/components/colaboradores/editor/colaborador-list-panel";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const EditarColaboradorPage = () => {
  const { user } = useLoaderData();
  const navigate = useNavigate();
  const params = useParams();
  const [selectedGroups, setSelectedGroups] = useState<GruposTypeModel[]>([]);
  const [isMobileListOpen, setIsMobileListOpen] = useState(false);
  const [isDesktopListHidden, setIsDesktopListHidden] = useState(false);
  const activeId = Number(params.id ?? user?.id);
  return (
    <div className="flex h-[calc(100svh-6rem)] max-h-[calc(100svh-6rem)] min-h-0 flex-col gap-4 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button size="icon" onClick={() => navigate(-1)} className="text-custom-gray cursor-pointer bg-transparent hover:bg-transparent">
            <ArrowLeft />
          </Button>
          <Title text="Editar" />
        </div>

        <Sheet open={isMobileListOpen} onOpenChange={setIsMobileListOpen}>
          <SheetTrigger asChild>
            <Button type="button" variant="outline" className="lg:hidden">
              <PanelLeft className="mr-2 h-4 w-4" />
              Colaboradores
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full p-3 sm:max-w-md">
            <SheetHeader className="sr-only">
              <SheetTitle>Colaboradores</SheetTitle>
            </SheetHeader>
            <div className="h-full pt-6">
              <ColaboradorListPanel activeId={activeId} onItemSelected={() => setIsMobileListOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div className={`grid h-full min-h-0 grid-cols-1 gap-4 overflow-hidden ${isDesktopListHidden ? "lg:grid-cols-1" : "lg:grid-cols-[360px_minmax(0,1fr)]"}`}>
        {!isDesktopListHidden && <ColaboradorListPanel activeId={activeId} className="hidden min-h-0 lg:block" />}
        <div
          className={`flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl bg-muted/20 p-2 md:p-3 ${
            isDesktopListHidden ? "lg:mx-auto lg:w-full lg:max-w-[1180px]" : ""
          }`}
        >
          <div className="sticky top-0 z-20 mb-3 flex-shrink-0 rounded-xl border bg-white px-4 py-3 shadow-sm dark:bg-neutral-950">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar className="h-12 w-12 border">
                  <AvatarImage src={user?.picture ?? undefined} alt={user?.name ?? "Colaborador"} />
                  <AvatarFallback>
                    {(user?.name ?? "AC")
                      .split(" ")
                      .slice(0, 2)
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <p className="truncate text-lg font-semibold text-foreground">{user?.name}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    @{user?.username} · {user?.agency?.name} · {user?.role?.role}
                  </p>
                  <p className="truncate text-xs text-muted-foreground/80">
                    {user?.email || "Sin correo"} {user?.cif ? `· ID ${user.cif}` : ""} {user?.dpi ? `· DPI ${user.dpi}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${user?.is_active
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                    : "bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                    }`}
                >
                  {user?.is_active ? "Activo" : "Inactivo"}
                </span>
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-hidden">
            <FormColaborador selectedGroups={selectedGroups} setSelectedGroups={setSelectedGroups} user={user ?? undefined} />
          </div>
        </div>
        </div>

        <div className="pointer-events-none absolute inset-y-0 hidden lg:block">
          <div
            className={`pointer-events-auto absolute top-1/2 -translate-y-1/2 ${
              isDesktopListHidden ? "left-2" : "left-[calc(360px-0.75rem)]"
            }`}
          >
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full bg-background shadow-sm"
              onClick={() => setIsDesktopListHidden((prev) => !prev)}
              aria-label={isDesktopListHidden ? "Mostrar colaboradores" : "Ocultar colaboradores"}
              title={isDesktopListHidden ? "Mostrar colaboradores" : "Ocultar colaboradores"}
            >
              {isDesktopListHidden ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
