import { cn } from "@/lib/utils";
import { Watch } from "lucide-react";
import { Link } from "wouter";
import { GradientText } from "@/components/ui/gradient-text";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl"
  };
  
  return (
    <Link href="/">
      <div className={cn("flex items-center font-bold cursor-pointer", className)}>
        <div className="mr-2 flex items-center justify-center text-primary">
          <Watch strokeWidth={2.5} className={cn("h-6 w-6", { 
            "h-5 w-5": size === "sm",
            "h-7 w-7": size === "lg"
          })} />
        </div>
        <div className={cn("font-bold", sizeClasses[size])}>
          Watch<GradientText>AR</GradientText>
        </div>
      </div>
    </Link>
  );
}