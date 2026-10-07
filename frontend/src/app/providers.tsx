"use client";

import { Toaster } from "sonner";
import { ReactNode, useEffect } from "react";
import { AuthProvider } from "@/hooks/use-auth";
import Lenis from "lenis";

function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      syncTouch: true,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };

    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return children;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <SmoothScroll>{children}</SmoothScroll>
      <Toaster position="top-right" richColors />
    </AuthProvider>
  );
}
