import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AlertCircle, ArrowLeftIcon, EyeIcon, EyeOffIcon, Key, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import logoAcredicom from "@/assets/img/Logo_acredicom_azul_horizontal.webp";
import { TypographyMuted } from "@/components/ui/typography";
import { useAuthStore } from "@/store/useAuth.store";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { verifyOTP } from "@/services/auth/auth.services";
import { toast } from "sonner";
import { OTPSchema, OTPSchemaType } from "@/schemas/auth/otp.schema";
import { environment } from "@/config/environment";
import { logger } from "@/lib/logger";

export const FormCodeOtp = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const form = useForm<OTPSchemaType>({
    resolver: zodResolver(OTPSchema),
    defaultValues: {
      email: email,
      otp: "",
      new_password: "",
      confirm_password: "",
    },
    mode: "onChange",
  });
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: OTPSchemaType) => {
    try {
      const response = await verifyOTP(email, data.otp, data.new_password);
      toast.success(response.message, {
        duration: 10000,
        icon: "🔑",
        position: "bottom-right",
      });
      // Redirigir según si es URL externa o ruta interna
      const redirectTarget = environment.passwordResetRedirectUrl;
      const isExternal = /^https?:\/\//i.test(redirectTarget);
      if (isExternal) {
        window.location.href = redirectTarget;
      } else {
        navigate(redirectTarget);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      logger.errorWithContext("Error al verificar OTP", error);
      setErrorMessage(error.response?.data?.error || "Error al verificar el código OTP");
    }
  };

  const { isSubmitting } = form.formState;
  const togglePasswordVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowPassword((prev) => !prev);
  };
  const toggleConfirmPasswordVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowConfirmPassword((prev) => !prev);
  };
  return (
    <Card className="container mx-auto max-w-lg border-none bg-transparent shadow-none">
      <Button variant="ghost" className="absolute top-4 right-4 -translate-x-1/2 translate-y-1/2 border" onClick={() => navigate(-1)}>
        <ArrowLeftIcon className="size-20" width={20} height={20} />
      </Button>
      <CardHeader>
        <CardTitle className="flex flex-col items-center justify-center gap-2 text-center text-4xl">
          <img src={logoAcredicom} alt="Logo Acredicom" />
          <TypographyMuted text="Verificación de código OTP" className="text-custom/85 text-2xl" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {errorMessage && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="size-8" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription> {errorMessage} </AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="text-primary-foreground/75">
                  <FormLabel>Código OTP</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ingrese su código OTP" startContent={<Key />} />
                  </FormControl>
                  {/* <FormDescription>Ejemplo: mcdejemplo</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="new_password"
              render={({ field }) => (
                <FormItem className="text-primary-foreground/75">
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="*******"
                      type={showPassword ? "text" : "password"}
                      endContent={
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-5 w-5 hover:bg-transparent hover:text-black"
                          onClick={(e) => togglePasswordVisibility(e)}
                        >
                          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </Button>
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem className="text-primary-foreground/75">
                  <FormLabel>Confirmar contraseña</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="*******"
                      type={showConfirmPassword ? "text" : "password"}
                      endContent={
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-5 w-5 hover:bg-transparent hover:text-black"
                          onClick={(e) => toggleConfirmPasswordVisibility(e)}
                        >
                          {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </Button>
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="mt-5 rounded-full" type="submit" disabled={isSubmitting ? true : false} variant="custom2">
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> <span>Validando...</span>
                </>
              ) : (
                "Validar OTP"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
