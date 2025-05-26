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
import { useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeftIcon, Loader2, MailIcon } from "lucide-react";
import { useEffect, useState } from "react";
import logoAcredicom from "@/assets/img/Logo_acredicom_azul_horizontal.webp";
import { TypographyMuted } from "@/components/ui/typography";
import { useAuthStore } from "@/store/useAuth.store";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { forgotPasswordSchema, forgotPasswordSchemaType } from "@/schemas/auth/forgot-password.schema";
import { forgotPassword } from "@/services/auth/auth.services";
import { toast } from "sonner";

export const FormForgotPassword = () => {
  const form = useForm<forgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: forgotPasswordSchemaType) => {
    try {
      const response = await forgotPassword(data.email);
      toast.success(response.detail, {
        duration: 10000,
        icon: "🔑",
        position: "bottom-right",
      });
      navigate(`/auth/code-otp?email=${data.email}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setErrorMessage(error.response.data.detail);
    }
  };

  const { isSubmitting } = form.formState;

  return (
    <Card className="container mx-auto max-w-lg border-none bg-transparent shadow-none">
      <Button variant="ghost" className="absolute top-4 right-4 -translate-x-1/2 translate-y-1/2 border" onClick={() => navigate(-1)}>
        <ArrowLeftIcon className="size-20" width={20} height={20} />
      </Button>
      <CardHeader>
        <CardTitle className="flex flex-col items-center justify-center gap-2 text-center text-4xl">
          <img src={logoAcredicom} alt="Logo Acredicom" />
          <TypographyMuted text="Recuperar contraseña" className="text-custom/85 text-2xl" />
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
              name="email"
              render={({ field }) => (
                <FormItem className="text-primary-foreground/75">
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ingrese su correo electrónico" startContent={<MailIcon />} />
                  </FormControl>
                  {/* <FormDescription>Ejemplo: mcdejemplo</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="mt-5 rounded-full" type="submit" disabled={isSubmitting ? true : false} variant="custom2">
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> <span>Enviando...</span>
                </>
              ) : (
                "Enviar código"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
