import { FormLogin } from "@/components/form/auth/form-login";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import imgCampesino from "@/assets/background/bg_incio_sesion.webp";

export default function LoginPage() {
  const isMobile = useIsMobile();
  return (
    <article
      className={cn(
        "container relative z-20 mx-auto flex items-center justify-between rounded-[5rem] bg-white sm:max-h-[55rem] sm:p-8",
        { "rounded-none": isMobile }
      )}
    >
      <div className={cn("w-1/2", { "w-full": isMobile })}>
        <FormLogin />
      </div>
      {!isMobile && (
        <div className="w-1/2">
          <img src={imgCampesino} alt="campesino" className="ml-auto h-[50rem] w-full rounded-[5rem] object-cover" />
        </div>
      )}
    </article>
  );
}
