import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  variant?: "default" | "interactive";
  children?: ReactNode;
}

export function GlassCard({ className, children, variant = "default", ...props }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-xl",
        variant === "interactive" && "cursor-pointer transition-all hover:bg-white/5 hover:border-white/20 hover:shadow-2xl hover:-translate-y-1 active:scale-95",
        className
      )}
      {...props}
    >
      {/* Noise Texture Overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-5" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />
      
      {/* Gradient Glow */}
      <div className="pointer-events-none absolute -inset-[100%] opacity-20 blur-3xl bg-gradient-radial from-white/10 to-transparent" />

      <div className="relative z-10 h-full">
        {children}
      </div>
    </motion.div>
  );
}
