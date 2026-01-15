import { Title } from "@/components/title/Title";
import { ProfileInfo } from "@/components/profile/profile-info";
import { ProfilePictureUpload } from "@/components/profile/profile-picture-upload";
import { MFASettings } from "@/components/profile/mfa-settings";

/**
 * Página de perfil del usuario
 * Accesible para todos los usuarios autenticados (is_staff y no staff)
 */
export default function ProfilePage() {
  return (
    <section className="animate-in fade-in-0 duration-500 p-4 sm:p-6 md:p-8">
      <Title />
      <article className="mt-4 sm:mt-6 md:mt-8 space-y-4 sm:space-y-6 md:space-y-8">
        {/* Información del usuario - Ocupa todo el ancho */}
        <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
          <ProfileInfo />
        </div>

        {/* Foto de perfil y MFA - Grid adaptativo: 1 columna móvil, 2 columnas desktop */}
        <div className="grid gap-4 sm:gap-6 md:gap-6 grid-cols-1 md:grid-cols-2">
          <div className="animate-in fade-in-0 slide-in-from-left-4 duration-500 delay-100">
            <ProfilePictureUpload />
          </div>
          <div className="animate-in fade-in-0 slide-in-from-right-4 duration-500 delay-100">
            <MFASettings />
          </div>
        </div>
      </article>
    </section>
  );
}
