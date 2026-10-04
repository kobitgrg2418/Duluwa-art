'use client';
import { ArrowRight } from 'lucide-react';
import { cn } from "@/lib/utils";

interface FlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  variant?: 'default' | 'outline' | 'ghost';
  loading?: boolean;
}

export function FlowButton({ 
  text = "Modern Button", 
  variant = 'default',
  loading = false,
  className,
  disabled,
  ...props 
}: FlowButtonProps) {
  return (
    <button 
      className={cn(
        "group relative flex items-center gap-1 overflow-hidden border cursor-pointer transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.95]",
        variant === 'default' 
          ? "rounded-[100px] border-[1.5px] border-foreground/40 bg-transparent px-8 py-3 text-sm font-semibold text-foreground hover:border-transparent hover:text-background hover:rounded-[12px]"
          : variant === 'outline'
          ? "rounded-[100px] border-[1.5px] border-foreground/20 bg-transparent px-8 py-3 text-sm font-semibold text-foreground hover:border-transparent hover:text-background hover:rounded-[12px]"
          : "rounded-[100px] border-[1.5px] border-transparent bg-transparent px-8 py-3 text-sm font-semibold text-foreground hover:border-transparent hover:text-background hover:rounded-[12px]",
        (disabled || loading) && "opacity-50 cursor-not-allowed pointer-events-none",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {/* Left arrow (arr-2) */}
      <ArrowRight 
        className={cn(
          "absolute w-4 h-4 left-[-25%] z-[9] group-hover:left-4 transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          variant === 'default' 
            ? "stroke-foreground fill-none group-hover:stroke-background"
            : "stroke-foreground fill-none group-hover:stroke-background"
        )} 
      />

      {/* Text */}
      <span className="relative z-[1] -translate-x-3 group-hover:translate-x-3 transition-all duration-[800ms] ease-out">
        {loading ? "Loading..." : text}
      </span>

      {/* Circle */}
      <span className={cn(
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-[50%] opacity-0 group-hover:w-[220px] group-hover:h-[220px] group-hover:opacity-100 transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)]",
        variant === 'default' ? "bg-foreground" : "bg-foreground"
      )}></span>

      {/* Right arrow (arr-1) */}
      <ArrowRight 
        className={cn(
          "absolute w-4 h-4 right-4 z-[9] group-hover:right-[-25%] transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          variant === 'default' 
            ? "stroke-foreground fill-none group-hover:stroke-background"
            : "stroke-foreground fill-none group-hover:stroke-background"
        )} 
      />
    </button>
  );
}
