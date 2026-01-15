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
import { AlertCircle, ArrowLeftIcon, Key, Loader2 } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import logoAcredicom from "@/assets/img/Logo_acredicom_azul_horizontal.webp";
import { TypographyMuted } from "@/components/ui/typography";
import { useAuthStore } from "@/store/useAuth.store";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/services/auth/auth.services";

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
  const [errorMessage, setErrorMessage] = useState("");
  const [isBackupCode, setIsBackupCode] = useState(false);
  const navigate = useNavigate();

  // Obtener información del usuario para determinar redirección
  const { data: user } = useQuery({
    queryKey: ["info_user"],
    queryFn: getProfile,
    enabled: isAuthenticated, // Solo ejecutar si está autenticado
    staleTime: 1000 * 60 * 60,
  });

  // Verificar si hay credenciales pendientes
  useEffect(() => {
    if (!pendingCredentials) {
      // Si no hay credenciales pendientes, redirigir al login
      navigate("/auth/login");
    }
  }, [pendingCredentials, navigate]);

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const errorMsg = error?.error || error?.detail || "Código de verificación inválido. Por favor, intente nuevamente.";
        setErrorMessage(errorMsg);
        // Limpiar el campo de código para permitir reintento
        form.setValue("code", "");
      }
    },
    [loginWithMFA, form]
  );

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
            text={isBackupCode ? "Código de respaldo" : "Verificación de dos factores"}
            className="text-custom/85 text-2xl"
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {errorMessage && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="size-8" />
            <AlertTitle>Error</AlertTitle>
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
                        : "Código de verificación (6 dígitos)"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={
                          isBackupCode
                            ? "Ingrese código de respaldo"
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
              <div className="text-center">
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
              </div>
            </div>
            <div className="space-y-2">
              <TypographyMuted
                text={
                  isBackupCode
                    ? "Ingrese uno de sus códigos de respaldo de 8 caracteres"
                    : "Ingrese el código de 6 dígitos de su aplicación autenticadora (Google Authenticator, Authy, etc.)"
                }
                className="text-center text-sm"
              />
            </div>
            <Button
              className="mt-5 rounded-full"
              type="submit"
              disabled={isSubmitting || !code || (isBackupCode ? code.length !== 8 : code.length !== 6)}
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
