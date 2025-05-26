import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import imgCampesino from "@/assets/background/bg_incio_sesion.webp";
import { FormCodeOtp } from "@/components/form/auth/code-otp";

export default function CodeOtpPage() {
  const isMobile = useIsMobile();
  return (
    <article
      className={cn("relative z-20 container mx-auto flex items-center justify-between rounded-[5rem] bg-white sm:max-h-[55rem] sm:p-8", {
        "rounded-none": isMobile,
      })}
    >
      {!isMobile && (
        <div className="w-1/2">
          <img src={imgCampesino} alt="campesino" className="ml-auto h-[50rem] w-full rounded-[5rem] object-cover" />
        </div>
      )}
      <div className={cn("w-1/2", { "w-full": isMobile })}>
        <FormCodeOtp />
      </div>
    </article>
  );
}
