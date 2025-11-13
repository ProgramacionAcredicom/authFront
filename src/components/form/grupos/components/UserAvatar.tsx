import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  picture?: string | null;
  name: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-5 w-5",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

/**
 * Componente para mostrar el avatar de un usuario
 */
export function UserAvatar({ picture, name, size = "md" }: UserAvatarProps) {
  const getInitials = (fullName: string): string => {
    if (!fullName) return "U";
    return fullName
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Avatar className={sizeClasses[size]}>
      {picture ? (
        <AvatarImage src={picture} alt={name} />
      ) : (
        <AvatarFallback className="text-xs">
          {getInitials(name)}
        </AvatarFallback>
      )}
    </Avatar>
  );
}

