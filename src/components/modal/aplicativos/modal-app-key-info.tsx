import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Key, Calendar, Hash, AlertCircle } from "lucide-react";
import { useQueryAppKeyInfo } from "@/hooks/aplicativos/useMutationAplicativos";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale/es";
import { useEffect } from "react";

interface ModalAppKeyInfoProps {
  isOpen: boolean;
  onClose: () => void;
  aplicativoId: string;
  aplicativoNombre: string;
}

export const ModalAppKeyInfo = ({ isOpen, onClose, aplicativoId, aplicativoNombre }: ModalAppKeyInfoProps) => {
  const { queryAppKeyInfo } = useQueryAppKeyInfo(aplicativoId, isOpen);

  // Forzar refetch cuando el modal se abre
  useEffect(() => {
    if (isOpen && aplicativoId) {
      console.log("Modal abierto, refetching App Key Info para aplicativo:", aplicativoId);
      // Usar setTimeout para asegurar que el modal esté completamente montado
      const timeoutId = setTimeout(() => {
        queryAppKeyInfo.refetch().catch((error) => {
          console.error("Error al refetch App Key Info:", error);
        });
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen, aplicativoId]);

  // Debug: Log para ver qué está pasando
  if (queryAppKeyInfo.data) {
    console.log("App Key Info Data:", queryAppKeyInfo.data);
  }
  if (queryAppKeyInfo.error) {
    console.error("App Key Info Error:", queryAppKeyInfo.error);
  }

  return (
    <Modal title="Información de App Key" description={`Información de la App Key para ${aplicativoNombre}`} isOpen={isOpen} onClose={onClose} className="sm:max-w-2xl">
      {queryAppKeyInfo.isLoading ? (
        <div className="flex justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : queryAppKeyInfo.error ? (
        <div className="space-y-4">
          <div className="bg-destructive/10 border-destructive/20 rounded-lg border p-4">
            <div className="flex gap-3">
              <AlertCircle className="text-destructive mt-0.5 h-5 w-5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-destructive text-sm font-medium">Error</p>
                <p className="text-muted-foreground text-sm">
                  {(() => {
                    const error = queryAppKeyInfo.error as any;
                    if (error?.response?.data?.error) {
                      return error.response.data.error;
                    }
                    if (error?.response?.status === 404) {
                      return "Aplicativo no encontrado";
                    }
                    if (error?.response?.status === 403) {
                      return "No tiene permisos para realizar esta acción";
                    }
                    if (error?.response?.status === 401) {
                      return "No autorizado. Por favor, inicie sesión nuevamente";
                    }
                    if (error instanceof Error) {
                      return error.message;
                    }
                    return "Error al obtener información de la App Key";
                  })()}
                </p>
                <p className="text-muted-foreground text-xs mt-2">
                  ID del aplicativo: {aplicativoId}
                </p>
              </div>
            </div>
          </div>
          <div className="flex w-full items-center justify-end space-x-2 pt-6">
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
      ) : queryAppKeyInfo.data ? (
        <div className="space-y-4">
          <Card className="gap-0">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg">
                <span className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  {queryAppKeyInfo.data.aplicativo_nombre}
                </span>
                <Badge variant={queryAppKeyInfo.data.has_app_key ? "default" : "secondary"}>
                  {queryAppKeyInfo.data.has_app_key ? "Clave Configurada" : "Sin Clave"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {queryAppKeyInfo.data.has_app_key ? (
                <>
                  {queryAppKeyInfo.data.app_key_created_at && (
                    <div className="flex items-center gap-3">
                      <Calendar className="text-muted-foreground h-4 w-4" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Fecha de Creación</p>
                        <p className="text-muted-foreground text-sm">
                          {format(new Date(queryAppKeyInfo.data.app_key_created_at), "PPpp", { locale: es })}
                        </p>
                      </div>
                    </div>
                  )}
                  {queryAppKeyInfo.data.app_key_last_chars && (
                    <div className="flex items-center gap-3">
                      <Hash className="text-muted-foreground h-4 w-4" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Últimos Caracteres</p>
                        <p className="text-muted-foreground font-mono text-sm">{queryAppKeyInfo.data.app_key_last_chars}</p>
                      </div>
                    </div>
                  )}
                  {!queryAppKeyInfo.data.app_key_created_at && !queryAppKeyInfo.data.app_key_last_chars && (
                    <div className="bg-muted/50 rounded-lg border p-4">
                      <p className="text-muted-foreground text-sm text-center">
                        La App Key está configurada pero no hay información adicional disponible.
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-muted/50 rounded-lg border p-4">
                  <p className="text-muted-foreground text-sm text-center">Este aplicativo no tiene una App Key configurada.</p>
                  <p className="text-muted-foreground text-xs text-center mt-2">
                    Usa el botón "Generar App Key" para crear una nueva clave.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="flex w-full items-center justify-end space-x-2 pt-6">
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
      ) : null}
    </Modal>
  );
};

