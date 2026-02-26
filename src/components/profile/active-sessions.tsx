import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getActiveSessions, closeSessions } from "@/services/auth/sessions.services";
import { Badge } from "@/components/ui/badge";
import { Loader2, Monitor, Smartphone, Tablet, LogOut, Globe, Calendar, Info, AlertCircle, Clock, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Session } from "@/interfaces/sessions.interfaces";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type SessionActionError = {
  response?: {
    data?: {
      error?: string;
    };
  };
  message?: string;
};

/**
 * Componente para mostrar y gestionar las sesiones activas del usuario
 */
export const ActiveSessions = () => {
  const queryClient = useQueryClient();
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [showCloseDialog, setShowCloseDialog] = useState(false);

  const { data: sessionsData, isLoading, error } = useQuery({
    queryKey: ["active_sessions"],
    queryFn: getActiveSessions,
    staleTime: 1000 * 30, // 30 segundos
    refetchInterval: 1000 * 60, // Refrescar cada minuto
  });

  const closeSessionMutation = useMutation({
    mutationFn: (sessionIds: number[]) => closeSessions(sessionIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["active_sessions"] });
      toast.success("Sesión cerrada correctamente");
      setShowCloseDialog(false);
      setSelectedSessionId(null);
    },
    onError: (error: unknown) => {
      const apiError = error as SessionActionError;
      const errorMessage = apiError.response?.data?.error || apiError.message || "Error al cerrar la sesión";
      toast.error(errorMessage);
    },
  });

  const handleCloseSession = (sessionId: number) => {
    setSelectedSessionId(sessionId);
    setShowCloseDialog(true);
  };

  const confirmCloseSession = () => {
    if (selectedSessionId) {
      closeSessionMutation.mutate([selectedSessionId]);
    }
  };

  const getDeviceIcon = (deviceInfo: string | null) => {
    if (!deviceInfo) return <Monitor className="h-4 w-4" />;
    const lower = deviceInfo.toLowerCase();
    if (lower.includes("mobile") || lower.includes("android") || lower.includes("iphone")) {
      return <Smartphone className="h-4 w-4" />;
    }
    if (lower.includes("tablet") || lower.includes("ipad")) {
      return <Tablet className="h-4 w-4" />;
    }
    return <Monitor className="h-4 w-4" />;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch {
      return dateString;
    }
  };

  const getTimeUntilExpiry = (expiresAt: string) => {
    try {
      const expiry = new Date(expiresAt);
      const now = new Date();
      const diff = expiry.getTime() - now.getTime();
      
      if (diff <= 0) return "Expirada";
      
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      
      if (days > 0) return `${days} día${days > 1 ? "s" : ""}`;
      if (hours > 0) return `${hours} hora${hours > 1 ? "s" : ""}`;
      return `${minutes} minuto${minutes > 1 ? "s" : ""}`;
    } catch {
      return "N/A";
    }
  };

  if (isLoading) {
    return (
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="border-b border-border/40 pb-4">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4 pt-5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Sesiones Activas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm text-center py-4">
            Error al cargar las sesiones activas. Por favor, intenta nuevamente.
          </p>
        </CardContent>
      </Card>
    );
  }

  const sessions = sessionsData?.results || [];

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-primary" />
                Sesiones Activas
              </CardTitle>
              <CardDescription className="text-sm">
                Aquí puedes ver todos los dispositivos donde has iniciado sesión. Si ves algo sospechoso, cierra esa sesión inmediatamente.
              </CardDescription>
            </div>
            {sessions.length > 0 && (
              <Badge variant="secondary" className="flex-shrink-0">
                {sessions.length} {sessions.length === 1 ? 'sesión' : 'sesiones'}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Monitor className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No hay sesiones activas</h3>
              <p className="text-muted-foreground text-sm max-w-md">
                Actualmente no tienes ninguna sesión activa. Cuando inicies sesión desde cualquier dispositivo, aparecerá aquí.
              </p>
            </div>
          ) : (
            <>
              <Alert className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/20">
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <AlertDescription className="text-blue-800 dark:text-blue-300 text-sm">
                  <strong>¿Qué es esto?</strong> Estas son todas las sesiones donde has iniciado sesión. Si no reconoces alguna, ciérrala para proteger tu cuenta.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                {sessions.map((session: Session) => {
                  const timeUntilExpiry = session.expires_at ? getTimeUntilExpiry(session.expires_at) : null;
                  const isExpiringSoon = timeUntilExpiry && !timeUntilExpiry.includes("día") && !timeUntilExpiry.includes("hora");

                  return (
                    <div
                      key={session.id}
                      className="relative flex flex-col gap-4 rounded-lg border border-border bg-card p-4 transition-all hover:bg-muted/50 hover:shadow-sm"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="mt-1 rounded-lg p-2 bg-muted">
                            {getDeviceIcon(session.device_info)}
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-base">
                                {session.aplicativo?.nombre || "Aplicativo desconocido"}
                              </p>
                              {isExpiringSoon && (
                                <Badge variant="outline" className="border-amber-500 text-amber-700 dark:text-amber-400">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Expira pronto
                                </Badge>
                              )}
                            </div>
                            <p className="text-muted-foreground text-sm">
                              {session.device_info || "Dispositivo desconocido"}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCloseSession(session.id)}
                          disabled={closeSessionMutation.isPending}
                          className="flex-shrink-0"
                        >
                          {closeSessionMutation.isPending && selectedSessionId === session.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Cerrando...
                            </>
                          ) : (
                            <>
                              <LogOut className="mr-2 h-4 w-4" />
                              Cerrar
                            </>
                          )}
                        </Button>
                      </div>

                      {/* Información detallada */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t">
                        {session.ip_address && (
                          <div className="flex items-center gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-2 text-sm cursor-help">
                                  <Globe className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-muted-foreground">Dirección IP:</span>
                                  <span className="font-mono text-xs">{session.ip_address}</span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">La dirección IP identifica la ubicación de la conexión. Si no reconoces esta IP, considera cerrar la sesión.</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Iniciada:</span>
                          <span className="font-medium">{formatDate(session.created_at)}</span>
                        </div>
                        {session.expires_at && (
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Expira en:</span>
                            <span className={`font-medium ${
                              isExpiringSoon ? 'text-amber-600 dark:text-amber-400' : ''
                            }`}>
                              {timeUntilExpiry}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {sessions.length > 1 && (
                <Alert className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20">
                  <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <AlertDescription className="text-amber-800 dark:text-amber-300 text-sm">
                    <strong>Consejo de seguridad:</strong> Si tienes muchas sesiones abiertas, considera cerrar las que no uses regularmente para mantener tu cuenta más segura.
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              ¿Cerrar esta sesión?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2 pt-2">
              <p>
                Estás a punto de cerrar una sesión activa. Esto significa que:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-2">
                <li>La sesión se cerrará en ese dispositivo</li>
                <li>La persona tendrá que iniciar sesión nuevamente</li>
                <li>Si no reconoces esta sesión, es recomendable cerrarla</li>
              </ul>
              <p className="pt-2 font-medium">
                ¿Estás seguro de que deseas continuar?
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={closeSessionMutation.isPending}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCloseSession}
              disabled={closeSessionMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {closeSessionMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cerrando...
                </>
              ) : (
                <>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sí, cerrar sesión
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
};
