import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Key, AlertTriangle, Copy, Check, Loader2 } from "lucide-react";
import { useMutationGenerateAppKey } from "@/hooks/aplicativos/useMutationAplicativos";
import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale/es";
import { logger } from "@/lib/logger";

interface ModalGenerateAppKeyProps {
  isOpen: boolean;
  onClose: () => void;
  aplicativoId: string;
  aplicativoNombre: string;
}

export const ModalGenerateAppKey = ({ isOpen, onClose, aplicativoId, aplicativoNombre }: ModalGenerateAppKeyProps) => {
  const { mutation, isLoading } = useMutationGenerateAppKey();
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(true);

  const handleGenerate = () => {
    setShowConfirmation(false);
    mutation.mutate(
      { id: aplicativoId },
      {
        onSuccess: (data) => {
          setGeneratedKey(data.app_key);
          setShowKey(true);
        },
      }
    );
  };

  const handleCopy = async () => {
    if (generatedKey) {
      try {
        await navigator.clipboard.writeText(generatedKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        logger.errorWithContext("Error al copiar al portapapeles", error, {
          aplicativoId,
        });
      }
    }
  };

  const handleClose = () => {
    setShowKey(false);
    setShowConfirmation(true);
    setGeneratedKey(null);
    setCopied(false);
    onClose();
  };

  return (
    <Modal
      title={showKey ? "App Key Generada" : "Generar Nueva App Key"}
      description={showKey ? `Nueva App Key para ${aplicativoNombre}` : `¿Estás seguro de querer generar una nueva App Key para ${aplicativoNombre}?`}
      isOpen={isOpen}
      onClose={handleClose}
      className="sm:max-w-2xl"
    >
      {showConfirmation ? (
        <div className="space-y-4">
          <Card className="gap-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Key className="h-5 w-5" />
                {aplicativoNombre}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-destructive/10 border-destructive/20 rounded-lg border p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="text-destructive mt-0.5 h-5 w-5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-destructive text-sm font-medium">Advertencia Importante</p>
                    <p className="text-muted-foreground text-sm">
                      Al generar una nueva App Key, la clave anterior será reemplazada. La nueva clave solo se mostrará una vez. Asegúrate de guardarla de forma segura.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex w-full items-center justify-end space-x-2 pt-6">
            <Button variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button variant="custom2" onClick={handleGenerate} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generar App Key
            </Button>
          </div>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : showKey && generatedKey ? (
        <div className="space-y-4">
          <Card className="gap-0">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg">
                <span className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  App Key Generada
                </span>
                <Badge variant="default">Nueva Clave</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-destructive/10 border-destructive/20 rounded-lg border p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="text-destructive mt-0.5 h-5 w-5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-destructive text-sm font-medium">¡Importante!</p>
                    <p className="text-muted-foreground text-sm">
                      Esta clave solo se mostrará una vez. Guárdala de forma segura. No se mostrará nuevamente.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="app-key-input" className="text-sm font-medium">App Key</label>
                <div className="flex gap-2">
                  <Input
                    id="app-key-input"
                    type="text"
                    value={generatedKey}
                    readOnly
                    className="font-mono text-sm"
                    aria-label="App Key generada"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopy}
                    title="Copiar al portapapeles"
                    aria-label={copied ? "Copiado al portapapeles" : "Copiar al portapapeles"}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {copied && (
                  <p className="text-sm text-green-600">¡Copiado al portapapeles!</p>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                <p>
                  <strong>Aplicativo:</strong> {aplicativoNombre}
                </p>
                <p>
                  <strong>ID:</strong> {aplicativoId}
                </p>
                <p>
                  <strong>Fecha de creación:</strong> {format(new Date(), "PPpp", { locale: es })}
                </p>
              </div>
            </CardContent>
          </Card>
          <div className="flex w-full items-center justify-end space-x-2 pt-6">
            <Button variant="custom2" onClick={handleClose}>
              Cerrar
            </Button>
          </div>
        </div>
      ) : null}
    </Modal>
  );
};

