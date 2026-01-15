import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, enableMFA, disableMFA } from "@/services/auth/auth.services";
import { Badge } from "@/components/ui/badge";
import { Loader2, Shield, ShieldCheck, ShieldOff, QrCode, Key, Copy, Check, Smartphone, ExternalLink } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

/**
 * Componente para gestionar la configuraci?n MFA del usuario
 */
// Apps autenticadoras recomendadas
const authenticatorApps = [
  {
    name: "Google Authenticator",
    androidUrl: "https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2",
    iosUrl: "https://apps.apple.com/app/google-authenticator/id388497605",
  },
  {
    name: "Microsoft Authenticator",
    androidUrl: "https://play.google.com/store/apps/details?id=com.azure.authenticator",
    iosUrl: "https://apps.apple.com/app/microsoft-authenticator/id983156458",
  },
  {
    name: "Authy",
    androidUrl: "https://play.google.com/store/apps/details?id=com.authy.authy",
    iosUrl: "https://apps.apple.com/app/authy/id494168017",
  },
];

export const MFASettings = () => {
  const queryClient = useQueryClient();
  const [showDisableDialog, setShowDisableDialog] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [showAppSelection, setShowAppSelection] = useState(false);
  const [appDownloaded, setAppDownloaded] = useState(false);
  const [mfaData, setMfaData] = useState<{
    qr_image_base64: string;
    backup_codes: string[];
    otp_url: string;
  } | null>(null);
  const [copiedCode, setCopiedCode] = useState<number | null>(null);

  const { data: user } = useQuery({
    queryKey: ["info_user"],
    queryFn: getProfile,
    staleTime: 1000 * 60 * 60,
  });

  const enableMutation = useMutation({
    mutationFn: () => enableMFA(),
    onSuccess: (data) => {
      setMfaData({
        qr_image_base64: data.qr_image_base64,
        backup_codes: data.backup_codes || [],
        otp_url: data.otp_url,
      });
      setShowQR(true);
      queryClient.invalidateQueries({ queryKey: ["info_user"] });
      toast.success("MFA habilitado correctamente. Escanea el c?digo QR con tu app autenticadora.");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.error || error?.message || "Error al habilitar MFA";
      toast.error(errorMessage);
    },
  });

  const disableMutation = useMutation({
    mutationFn: (code: string) => disableMFA(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["info_user"] });
      toast.success("MFA deshabilitado correctamente");
      setShowDisableDialog(false);
      setOtpCode("");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.detail || error?.message || "Error al deshabilitar MFA";
      toast.error(errorMessage);
    },
  });

  const handleEnableMFA = () => {
    // Primero mostrar el diálogo de selección de apps
    setShowAppSelection(true);
  };

  const handleContinueAfterAppSelection = () => {
    if (!appDownloaded) {
      toast.error("Por favor, confirma que has descargado al menos una aplicación");
      return;
    }
    // Cerrar diálogo de apps y llamar a la API
    setShowAppSelection(false);
    setAppDownloaded(false);
    enableMutation.mutate();
  };

  const handleCloseAppSelection = () => {
    setShowAppSelection(false);
    setAppDownloaded(false);
  };

  const handleDisableMFA = () => {
    if (!otpCode || otpCode.length !== 6) {
      toast.error("Por favor, ingresa un c?digo OTP v?lido de 6 d?gitos");
      return;
    }
    disableMutation.mutate(otpCode);
  };

  const handleCopyBackupCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(index);
    toast.success("C?digo copiado al portapapeles");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCloseQR = () => {
    setShowQR(false);
    setMfaData(null);
  };

  const isMFAEnabled = user?.otp_enabled || false;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Autenticación de Dos Factores (MFA)
          </CardTitle>
          <CardDescription>
            Protege tu cuenta con autenticación de dos factores usando una app autenticadora
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Estado y acci?n principal */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-semibold">Estado actual</p>
              <div className="flex flex-wrap items-center gap-3">
                {isMFAEnabled ? (
                  <>
                    <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                      <ShieldCheck className="mr-1 h-3 w-3" />
                      Habilitado
                    </Badge>
                    <p className="text-muted-foreground text-sm">
                      Tu cuenta está protegida con autenticación de dos factores
                    </p>
                  </>
                ) : (
                  <>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                      <ShieldOff className="mr-1 h-3 w-3" />
                      Deshabilitado
                    </Badge>
                    <p className="text-muted-foreground text-sm">
                      Tu cuenta no está protegida con MFA
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="flex-shrink-0">
              {isMFAEnabled ? (
                <Button
                  variant="destructive"
                  onClick={() => setShowDisableDialog(true)}
                  disabled={disableMutation.isPending}
                  className="w-full sm:w-auto"
                >
                  {disableMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deshabilitando...
                    </>
                  ) : (
                    <>
                      <ShieldOff className="mr-2 h-4 w-4" />
                      Deshabilitar MFA
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleEnableMFA}
                  disabled={enableMutation.isPending}
                  className="w-full sm:w-auto"
                >
                  {enableMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Habilitando...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Habilitar MFA
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Informaci?n contextual */}
          {isMFAEnabled ? (
            <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20">
              <ShieldCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-300">
                <strong>Protección activa:</strong> Tu cuenta está protegida con autenticación de dos factores.
                Necesitarás un código de tu app autenticadora cada vez que inicies sesión.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="default" className="border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950/20">
              <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <AlertDescription className="text-yellow-800 dark:text-yellow-300">
                <strong>Recomendación:</strong> Activa la autenticación de dos factores para mejorar la seguridad
                de tu cuenta. Esto añade una capa adicional de protección contra accesos no autorizados.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Dialog para selección de apps autenticadoras */}
      <Dialog open={showAppSelection} onOpenChange={handleCloseAppSelection}>
        <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              Descarga una App Autenticadora
            </DialogTitle>
            <DialogDescription>
              Para usar autenticación de dos factores, necesitas una app autenticadora en tu dispositivo móvil.
              Selecciona una de las siguientes opciones recomendadas:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              {authenticatorApps.map((app, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border bg-card p-3 transition-all hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Smartphone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{app.name}</p>
                      <p className="text-muted-foreground text-xs">Disponible para Android e iOS</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      asChild
                      className="h-8 text-xs"
                    >
                      <a
                        href={app.androidUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="mr-1 h-3 w-3" />
                        Android
                      </a>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      asChild
                      className="h-8 text-xs"
                    >
                      <a
                        href={app.iosUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="mr-1 h-3 w-3" />
                        iOS
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-start space-x-3 rounded-lg border bg-muted/30 p-3">
              <Checkbox
                id="app-downloaded"
                checked={appDownloaded}
                onCheckedChange={(checked) => setAppDownloaded(checked === true)}
                className="mt-0.5"
              />
              <label
                htmlFor="app-downloaded"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                He descargado al menos una de estas aplicaciones
              </label>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs sm:text-sm">
                Una vez que hayas descargado la app, marca la casilla y continúa para configurar MFA.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={handleCloseAppSelection}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleContinueAfterAppSelection}
              disabled={!appDownloaded}
              className="w-full sm:w-auto"
            >
              Continuar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para deshabilitar MFA */}
      <Dialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldOff className="h-5 w-5 text-destructive" />
              Deshabilitar Autenticación de Dos Factores
            </DialogTitle>
            <DialogDescription>
              Para deshabilitar MFA, necesitas ingresar un código OTP válido de tu app autenticadora. Esto
              asegura que eres el propietario de la cuenta.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Alert variant="destructive" className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <AlertDescription className="text-red-800 dark:text-red-300">
                <strong>Advertencia:</strong> Al deshabilitar MFA, tu cuenta ser? menos segura. Solo hazlo si
                es absolutamente necesario.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Label htmlFor="otp-code" className="text-base font-medium">
                C?digo OTP
              </Label>
              <Input
                id="otp-code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={otpCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setOtpCode(value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && otpCode.length === 6) {
                    handleDisableMFA();
                  }
                }}
                className="text-center text-2xl tracking-widest font-mono"
                autoFocus
              />
              <p className="text-muted-foreground text-xs">
                Ingresa el c?digo de 6 d?gitos de tu app autenticadora
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDisableDialog(false);
                setOtpCode("");
              }}
              disabled={disableMutation.isPending}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDisableMFA} disabled={disableMutation.isPending || otpCode.length !== 6}>
              {disableMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <ShieldOff className="mr-2 h-4 w-4" />
                  Deshabilitar MFA
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para mostrar QR code y códigos de respaldo */}
      <Dialog open={showQR} onOpenChange={handleCloseQR}>
        <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-4xl lg:max-w-5xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary" />
              Configura tu App Autenticadora
            </DialogTitle>
            <DialogDescription>
              Escanea el código QR con tu app autenticadora (Google Authenticator, Authy, Microsoft
              Authenticator, etc.)
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto py-4">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
              {/* Columna izquierda: QR y clave manual (2/3 del ancho en desktop) */}
              <div className="md:col-span-2 space-y-4">
                {/* QR Code */}
                {mfaData?.qr_image_base64 && (
                  <div className="flex flex-col items-center gap-4">
                    <div className="rounded-lg border-2 border-primary bg-white p-3 sm:p-4 shadow-lg transition-all hover:shadow-xl">
                      <img
                        src={`data:image/png;base64,${mfaData.qr_image_base64}`}
                        alt="QR Code para MFA"
                        className="h-48 w-48 sm:h-64 sm:w-64"
                      />
                    </div>
                    <div className="w-full space-y-2">
                      <p className="text-muted-foreground text-center text-xs sm:text-sm font-medium">
                        ¿No puedes escanear el código?
                      </p>
                      <p className="text-muted-foreground text-center text-xs">
                        Ingresa manualmente esta clave en tu app autenticadora:
                      </p>
                      <div className="flex w-full items-center gap-2">
                        <Input
                          value={mfaData.otp_url}
                          readOnly
                          className="font-mono text-xs"
                          onClick={(e) => (e.target as HTMLInputElement).select()}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            navigator.clipboard.writeText(mfaData.otp_url);
                            toast.success("Clave copiada al portapapeles");
                          }}
                          className="flex-shrink-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <Alert className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/20">
                  <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <AlertDescription className="text-blue-800 dark:text-blue-300 text-xs sm:text-sm">
                    <strong>Próximos pasos:</strong> Una vez que hayas escaneado el código QR y guardado los códigos
                    de respaldo, podrás usar tu app autenticadora para iniciar sesión. El código cambia cada 30
                    segundos.
                  </AlertDescription>
                </Alert>
              </div>

              {/* Columna derecha: Códigos de respaldo (1/3 del ancho en desktop) */}
              {mfaData?.backup_codes && mfaData.backup_codes.length > 0 && (
                <div className="md:col-span-1 space-y-3">
                  <Alert className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20">
                    <Key className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <AlertDescription className="text-amber-800 dark:text-amber-300 text-xs sm:text-sm">
                      <strong>¡Importante!</strong> Guarda estos códigos de respaldo en un lugar seguro. Solo se
                      mostrarán una vez.
                    </AlertDescription>
                  </Alert>
                  <div className="space-y-2">
                    <Label className="text-sm sm:text-base font-semibold">Códigos de respaldo</Label>
                    <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto">
                      {mfaData.backup_codes.map((code, index) => (
                        <div
                          key={index}
                          className="group flex items-center justify-between rounded-md border-2 border-dashed bg-muted/50 p-2 sm:p-3 transition-all hover:border-primary hover:bg-muted"
                        >
                          <code className="font-mono text-xs sm:text-sm font-semibold break-all">{code}</code>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 sm:h-7 sm:w-7 opacity-0 transition-opacity group-hover:opacity-100 flex-shrink-0 ml-2"
                            onClick={() => handleCopyBackupCode(code, index)}
                          >
                            {copiedCode === index ? (
                              <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-green-500" />
                            ) : (
                              <Copy className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full text-xs sm:text-sm"
                      onClick={() => {
                        const allCodes = mfaData.backup_codes.join("\n");
                        navigator.clipboard.writeText(allCodes);
                        toast.success("Todos los códigos copiados al portapapeles");
                      }}
                    >
                      <Copy className="mr-2 h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      Copiar todos los códigos
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={handleCloseQR} className="w-full sm:w-auto min-h-[44px]">
              Entendido, he configurado mi app
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
