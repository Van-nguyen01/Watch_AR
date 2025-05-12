import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Smartphone } from "lucide-react";

interface ARButtonProps {
  watchId: number;
  variant?: "quick" | "full"; // "quick" for Quick AR, "full" for Full AR
}

export function ARButton({ watchId, variant = "full" }: ARButtonProps) {
  return (
    <Link to={`/try-on/${watchId}`}>
      <Button
        size="sm"
        variant={variant === "quick" ? "outline" : "default"}
        className={variant === "quick" ? "bg-white/90 text-primary hover:bg-primary/10" : ""}
      >
        <Smartphone className="mr-2 h-4 w-4" />
        {variant === "quick" ? "Quick AR" : "Try AR"}
      </Button>
    </Link>
  );
}