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
import { loginSchema, loginSchemaType } from "@/schemas/auth/login.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, EyeIcon, EyeOffIcon, Loader2, UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import logoAcredicom from "@/assets/img/Logo_acredicom_azul_horizontal.webp";
import { TypographyMuted } from "@/components/ui/typography";
import { useAuthStore } from "@/store/useAuth.store";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const FormLogin = () => {
  const form = useForm<loginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onChange",
  });
  const loginAuth = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: loginSchemaType) => {
    try {
      await loginAuth(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setErrorMessage(error.detail);
    }
  };

  const { isSubmitting } = form.formState;

  const togglePasswordVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowPassword((prev) => !prev);
  };
  return (
    <Card className="container mx-auto max-w-lg border-none bg-transparent shadow-none">
      <CardHeader>
        <CardTitle className="flex flex-col items-center justify-center gap-2 text-center text-4xl">
          <img src={logoAcredicom} alt="Logo Acredicom" />
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
              name="username"
              render={({ field }) => (
                <FormItem className="text-primary-foreground/75">
                  <FormLabel>Usuario</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ingrese su usuario" startContent={<UserIcon />} />
                  </FormControl>
                  {/* <FormDescription>Ejemplo: mcdejemplo</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
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
            <Button className="mt-5 rounded-full" type="submit" disabled={isSubmitting ? true : false} variant="custom2">
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> <span>Iniciando sesión...</span>
                </>
              ) : (
                "Iniciar sesión"
              )}
            </Button>
            <div className="mx-auto flex gap-1">
              <TypographyMuted text="Olvide mi contraseña," />
              <Link to={"/auth/forgot-password"} className="text-sm text-blue-600">
                recuperar.
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
