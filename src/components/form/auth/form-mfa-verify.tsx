import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { mfaVerifySchema } from "@/schemas/auth/mfa-verify.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeftIcon, Key, Loader2, Clock, RefreshCw } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import logoAcredicom from "@/assets/img/Logo_acredicom_azul_horizontal.webp";
import { TypographyMuted } from "@/components/ui/typography";
import { useAuthStore } from "@/store/useAuth.store";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getProfile, sendMFAEmailCode } from "@/services/auth/auth.services";
import { toast } from "sonner";

type ErrorWithResponseData = {
  response?: {
    data?: {
      error?: string;
      detail?: string;
    };
  };
  message?: string;
};

export const FormMFAVerify = () => {
  const form = useForm<{ code: string }>({
    resolver: zodResolver(mfaVerifySchema),
    defaultValues: {
      code: "",
    },
    mode: "onChange",
  });
  const loginWithMFA = useAuthStore((state) => state.loginWithMFA);
  const clearPendingCredentials = useAuthStore((state) => state.clearPendingCredentials);
  const pendingCredentials = useAuthStore((state) => state.pendingCredentials);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const getPendingCredentialsTimeRemaining = useAuthStore((state) => state.getPendingCredentialsTimeRemaining);
  const arePendingCredentialsExpired = useAuthStore((state) => state.arePendingCredentialsExpired);
  const [errorMessage, setErrorMessage] = useState("");
  const [isBackupCode, setIsBackupCode] = useState(false);
  const [isEmailMFA, setIsEmailMFA] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const navigate = useNavigate();

  // Mutation para reenviar código por email
  const resendCodeMutation = useMutation({
    mutationFn: sendMFAEmailCode,
    onSuccess: () => {
      toast.success("Código de verificación reenviado. Revisa tu correo electrónico.");
    },
    onError: (error: unknown) => {
      const apiError = error as ErrorWithResponseData;
      const errorMessage =
        apiError.response?.data?.error || apiError.response?.data?.detail || apiError.message || "Error al reenviar código";
      toast.error(errorMessage);
    },
  });

  // Obtener información del usuario para determinar redirección
  const { data: user } = useQuery({
    queryKey: ["info_user"],
    queryFn: getProfile,
    enabled: isAuthenticated, // Solo ejecutar si está autenticado
    staleTime: 1000 * 60 * 60,
  });

  // Verificar si hay credenciales pendientes y monitorear expiración
  useEffect(() => {
    if (!pendingCredentials) {
      // Si no hay credenciales pendientes, redirigir al login
      navigate("/auth/login");
      return;
    }

    // Verificar si ya están expiradas
    if (arePendingCredentialsExpired()) {
      setIsExpired(true);
      setErrorMessage("Las credenciales han expirado. Por favor, inicie sesión nuevamente.");
      // Redirigir después de 3 segundos
      const timer = setTimeout(() => {
        clearPendingCredentials();
        navigate("/auth/login");
      }, 3000);
      return () => clearTimeout(timer);
    }

    // Actualizar tiempo restante cada segundo
    const updateTimer = () => {
      const remaining = getPendingCredentialsTimeRemaining();
      setTimeRemaining(remaining);
      
      if (remaining !== null && remaining <= 0) {
        setIsExpired(true);
        setErrorMessage("Las credenciales han expirado. Por favor, inicie sesión nuevamente.");
        // Redirigir después de 3 segundos
        setTimeout(() => {
          clearPendingCredentials();
          navigate("/auth/login");
        }, 3000);
      }
    };

    // Actualizar inmediatamente
    updateTimer();

    // Actualizar cada segundo
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [pendingCredentials, navigate, arePendingCredentialsExpired, getPendingCredentialsTimeRemaining, clearPendingCredentials]);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Si el usuario es staff, redirigir a dashboard admin
      // Si no es staff, redirigir a perfil
      if (user.is_staff) {
        navigate("/");
      } else {
        navigate("/profile");
      }
    }
  }, [isAuthenticated, user, navigate]);


  const onSubmit = useCallback(
    async (data: { code: string }) => {
      try {
        setErrorMessage("");
        await loginWithMFA(data.code);
      } catch (error: unknown) {
        const apiError = error as ErrorWithResponseData;
        // Verificar si el error es por credenciales expiradas
        const errorMsg =
          (apiError as { error?: string; detail?: string }).error ||
          (apiError as { error?: string; detail?: string }).detail ||
          apiError.message ||
          "Código de verificación inválido. Por favor, intente nuevamente.";
        
        // Detectar si es error de expiración
        if (errorMsg.includes("expirado") || errorMsg.includes("expired") || arePendingCredentialsExpired()) {
          setIsExpired(true);
          setErrorMessage("Las credenciales han expirado. Por favor, inicie sesión nuevamente.");
          // Redirigir después de 3 segundos
          setTimeout(() => {
            clearPendingCredentials();
            navigate("/auth/login");
          }, 3000);
        } else {
          setErrorMessage(errorMsg);
          // Limpiar el campo de código para permitir reintento
          form.setValue("code", "");
        }
      }
    },
    [loginWithMFA, form, arePendingCredentialsExpired, clearPendingCredentials, navigate]
  );

  // Detectar si es MFA por email basándose en el mensaje de error o en el flujo
  useEffect(() => {
    // Si el mensaje de error menciona email, es MFA por email
    if (errorMessage && (errorMessage.includes("email") || errorMessage.includes("correo"))) {
      setIsEmailMFA(true);
    }
  }, [errorMessage]);

  const handleResendEmailCode = () => {
    resendCodeMutation.mutate();
  };

  const handleBackToLogin = () => {
    clearPendingCredentials();
    navigate("/auth/login");
  };

  const toggleCodeType = () => {
    setIsBackupCode(!isBackupCode);
    form.setValue("code", "");
    setErrorMessage("");
  };

  const { isSubmitting } = form.formState;
  const code = form.watch("code");

  // Si no hay credenciales pendientes, no renderizar nada (se redirigirá)
  if (!pendingCredentials) {
    return null;
  }

  return (
    <Card className="container mx-auto max-w-lg border-none bg-transparent shadow-none">
      <Button
        variant="ghost"
        className="absolute top-4 right-4 -translate-x-1/2 translate-y-1/2 border"
        onClick={handleBackToLogin}
      >
        <ArrowLeftIcon className="size-5" width={20} height={20} />
      </Button>
      <CardHeader>
        <CardTitle className="flex flex-col items-center justify-center gap-2 text-center text-4xl">
          <img src={logoAcredicom} alt="Logo Acredicom" />
          <TypographyMuted
            text={
              isBackupCode 
                ? "Código de respaldo" 
                : isEmailMFA 
                ? "Verificación por correo electrónico" 
                : "Verificación de dos factores"
            }
            className="text-custom/85 text-2xl"
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Contador de tiempo restante */}
        {timeRemaining !== null && timeRemaining > 0 && !isExpired && (
          <Alert className="mb-4 border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/20">
            <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-800 dark:text-blue-300">
              <strong>Tiempo restante:</strong> {Math.floor(timeRemaining / 60000)}:{(Math.floor((timeRemaining % 60000) / 1000)).toString().padStart(2, '0')} minutos
            </AlertDescription>
          </Alert>
        )}
        
        {errorMessage && (
          <Alert variant={isExpired ? "destructive" : "destructive"} className="mb-4">
            <AlertCircle className="size-8" />
            <AlertTitle>{isExpired ? "Credenciales Expiradas" : "Error"}</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="text-primary-foreground/75">
                    <FormLabel>
                      {isBackupCode
                        ? "Código de respaldo (8 caracteres)"
                        : isEmailMFA
                        ? "Código recibido por correo (6 dígitos)"
                        : "Código de verificación (6 dígitos)"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={
                          isBackupCode
                            ? "Ingrese código de respaldo"
                            : isEmailMFA
                            ? "Ingrese código del correo"
                            : "Ingrese código de 6 dígitos"
                        }
                        startContent={<Key />}
                        inputMode={isBackupCode ? "text" : "numeric"}
                        autoComplete={isBackupCode ? "off" : "one-time-code"}
                        maxLength={isBackupCode ? 8 : 6}
                        className="text-center text-2xl tracking-widest"
                        onChange={(e) => {
                          const value = isBackupCode
                            ? e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "")
                            : e.target.value.replace(/\D/g, "");
                          field.onChange(value);
                          
                          // Auto-submit cuando se completa el código TOTP (6 dígitos)
                          if (!isBackupCode && value.length === 6 && /^\d{6}$/.test(value)) {
                            // Pequeño delay para permitir que el usuario vea el código completo
                            setTimeout(() => {
                              form.handleSubmit(onSubmit)();
                            }, 300);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-center space-y-2">
                {!isEmailMFA && (
                  <Button
                    type="button"
                    variant="link"
                    className="text-sm text-blue-600"
                    onClick={toggleCodeType}
                  >
                    {isBackupCode
                      ? "Usar código de autenticador (6 dígitos)"
                      : "Usar código de respaldo (8 caracteres)"}
                  </Button>
                )}
                {isEmailMFA && (
                  <Button
                    type="button"
                    variant="link"
                    className="text-sm text-blue-600 flex items-center gap-2"
                    onClick={handleResendEmailCode}
                    disabled={resendCodeMutation.isPending}
                  >
                    {resendCodeMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Reenviando...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4" />
                        Reenviar código por correo
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <TypographyMuted
                text={
                  isBackupCode
                    ? "Ingrese uno de sus códigos de respaldo de 8 caracteres"
                    : isEmailMFA
                    ? "Revisa tu correo electrónico y ingresa el código de 6 dígitos que recibiste. El código expira en 10 minutos."
                    : "Ingrese el código de 6 dígitos de su aplicación autenticadora (Google Authenticator, Authy, etc.)"
                }
                className="text-center text-sm"
              />
            </div>
            <Button
              className="mt-5 rounded-full"
              type="submit"
              disabled={isSubmitting || isExpired || !code || (isBackupCode ? code.length !== 8 : code.length !== 6)}
              variant="custom2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> <span>Verificando...</span>
                </>
              ) : (
                "Verificar código"
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="mt-2"
              onClick={handleBackToLogin}
            >
              Volver al inicio de sesión
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
