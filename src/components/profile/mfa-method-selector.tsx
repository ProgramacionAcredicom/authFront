import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, Mail, Shield, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MFAMethod } from "@/interfaces/auth/mfa.interfaces";

interface MFAMethodSelectorProps {
  selectedMethod: MFAMethod;
  onMethodChange: (method: MFAMethod) => void;
  disabled?: boolean;
}

export const MFAMethodSelector = ({
  selectedMethod,
  onMethodChange,
  disabled = false,
}: MFAMethodSelectorProps) => {
  return (
    <div className="space-y-4">
      <Tabs value={selectedMethod} onValueChange={(value) => onMethodChange(value as MFAMethod)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="totp" disabled={disabled} className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            App Autenticadora
          </TabsTrigger>
          <TabsTrigger value="email" disabled={disabled} className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Correo Electrónico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="totp" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Autenticación por App (TOTP)
              </CardTitle>
              <CardDescription>
                Usa una aplicación autenticadora como Google Authenticator o Authy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Ventajas:</p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Más seguro - no depende de tu correo electrónico</li>
                  <li>Funciona sin conexión a internet</li>
                  <li>Recomendado por estándares de seguridad (NIST, OWASP)</li>
                  <li>Códigos cambian cada 30 segundos</li>
                </ul>
              </div>
              <Alert className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/20">
                <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <AlertDescription className="text-blue-800 dark:text-blue-300 text-sm">
                  <strong>Recomendado:</strong> Este es el método más seguro para autenticación de dos factores.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Autenticación por Correo Electrónico
              </CardTitle>
              <CardDescription>
                Recibe códigos de verificación por correo electrónico
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Características:</p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Fácil de usar - no requiere instalar aplicaciones</li>
                  <li>Códigos de 6 dígitos enviados por email</li>
                  <li>Expiración: 10 minutos</li>
                  <li>Un solo uso por código</li>
                </ul>
              </div>
              <Alert variant="default" className="border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950/20">
                <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                <AlertDescription className="text-yellow-800 dark:text-yellow-300 text-sm">
                  <strong>Advertencia de seguridad:</strong> Este método es menos seguro que la app autenticadora. 
                  Si tu correo electrónico está comprometido, un atacante podría acceder a tu cuenta. 
                  Se recomienda usar app autenticadora cuando sea posible.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
