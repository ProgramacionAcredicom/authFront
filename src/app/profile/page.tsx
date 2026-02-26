import { Title } from "@/components/title/Title";
import { ProfileInfo } from "@/components/profile/profile-info";
import { MFASettings } from "@/components/profile/mfa-settings";
import { ActiveSessions } from "@/components/profile/active-sessions";
import { PageIntro, PageShell } from "@/components/layout/page-shell";

/**
 * Página de perfil del usuario
 * Accesible para todos los usuarios autenticados (is_staff y no staff)
 */
export default function ProfilePage() {
  return (
    <PageShell>
      <PageIntro
        title={<Title />}
        description="Administra tu información personal, seguridad de acceso y sesiones activas desde una sola vista."
      />

      <article className="space-y-4 sm:space-y-6 md:space-y-8">
        <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
          <ProfileInfo />
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-4 sm:gap-6 2xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] 2xl:items-start">
          <div className="animate-in fade-in-0 slide-in-from-left-4 duration-500 delay-100">
            <MFASettings />
          </div>
          <div className="animate-in fade-in-0 slide-in-from-right-4 duration-500 delay-100">
            <ActiveSessions />
          </div>
        </div>
      </article>
    </PageShell>
  );
}
