import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  imageClassName?: string;
  showText?: boolean;
  variant?: "light" | "dark";
}

export function Logo({
  className,
  imageClassName,
  showText = false,
  variant = "light",
}: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 shrink-0", className)}>
      <Image
        src="/logo.png"
        alt="Honda Tiến Đạt"
        width={140}
        height={48}
        className={cn("h-10 w-auto object-contain", imageClassName)}
        priority
      />
      {showText && (
        <div className="hidden sm:block">
          <p
            className={cn(
              "font-bold text-sm leading-tight",
              variant === "light" ? "text-white" : "text-charcoal"
            )}
          >
            Honda Tiến Đạt
          </p>
          <p
            className={cn(
              "text-xs",
              variant === "light" ? "text-silver" : "text-muted-foreground"
            )}
          >
            Uy tín tạo nên giá trị
          </p>
        </div>
      )}
    </Link>
  );
}
