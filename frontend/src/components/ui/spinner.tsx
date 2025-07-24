import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function Spinner({ className }: { className?: string }) {
  return (
    <div className={cn("fixed inset-0 z-50 flex justify-center items-center bg-foreground/30 backdrop-blur-sm", className)}>
      <Loader2 className="animate-spin text-white" />
    </div>
  );
}
