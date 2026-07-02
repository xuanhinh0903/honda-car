"use client";

import { useLayoutEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getDealership } from "@/lib/data";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const dealership = getDealership();
export const SESSION_KEY = "honda-tien-dat-session-loader";
const MIN_DURATION_MS = 2200;
const COMPLETE_MS = 400;
const MAX_LOAD_PROGRESS = 90;

type LoaderStatus = "idle" | "loading" | "done";

export function shouldShowLoader(pathname: string): boolean {
  const isHome = pathname === "/";
  const sessionShown = sessionStorage.getItem(SESSION_KEY) === "1";
  return isHome || !sessionShown;
}

function setSplashActive(active: boolean) {
  document.documentElement.classList.toggle("splash-active", active);
}

export function PageLoader({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const [status, setStatus] = useState<LoaderStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [loaderKey, setLoaderKey] = useState(0);

  const showOverlay = status === "loading";

  useLayoutEffect(() => {
    if (reducedMotion || !shouldShowLoader(pathname)) {
      setSplashActive(false);
      setStatus("done");
      return;
    }

    setLoaderKey((k) => k + 1);
    setSplashActive(true);
    setStatus("loading");
    setProgress(0);

    const startTime = Date.now();
    let frame = 0;
    let completeTimeout: ReturnType<typeof setTimeout>;
    let pageReady = document.readyState === "complete";
    let completing = false;
    let completeStart = 0;
    let valueAtCompleteStart = 0;
    let current = 0;
    let dismissed = false;

    const onLoad = () => {
      pageReady = true;
    };
    if (!pageReady) {
      window.addEventListener("load", onLoad, { once: true });
    }

    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      if (sessionStorage.getItem(SESSION_KEY) !== "1") {
        sessionStorage.setItem(SESSION_KEY, "1");
      }
      setSplashActive(false);
      setStatus("done");
    };

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const minElapsed = elapsed >= MIN_DURATION_MS;

      if (pageReady && minElapsed && !completing) {
        completing = true;
        completeStart = Date.now();
        valueAtCompleteStart = current;
      }

      let next: number;

      if (completing) {
        const t = Math.min(1, (Date.now() - completeStart) / COMPLETE_MS);
        const ease = 1 - (1 - t) ** 2;
        next =
          valueAtCompleteStart + (100 - valueAtCompleteStart) * ease;

        if (t >= 1) {
          setProgress(100);
          completeTimeout = setTimeout(dismiss, 280);
          return;
        }
      } else {
        const t = Math.min(1, elapsed / MIN_DURATION_MS);
        const ease = 1 - (1 - t) ** 2;
        next = ease * MAX_LOAD_PROGRESS;
      }

      current = next;
      setProgress(next);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(completeTimeout);
      window.removeEventListener("load", onLoad);
    };
  }, [pathname, reducedMotion]);

  const displayProgress = Math.min(100, Math.round(progress));

  return (
    <>
      <div id="site-content" className="flex min-h-full flex-1 flex-col">
        {children}
      </div>

      <AnimatePresence mode="wait">
        {showOverlay && (
          <motion.div
            key={`page-loader-${loaderKey}`}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-charcoal overflow-hidden"
            aria-busy="true"
            aria-label="Đang tải"
          >
            <div className="absolute inset-0 bg-hero-gradient opacity-80" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.52_0.24_27/0.12)_0%,transparent_70%)]" />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative z-10 flex flex-col items-center px-6"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.6 }}
                className="mb-8"
              >
                <Image
                  src="/logo.png"
                  alt={dealership.name}
                  width={220}
                  height={80}
                  priority
                  className="h-20 w-auto object-contain drop-shadow-2xl"
                />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-silver text-sm tracking-[0.25em] uppercase mb-10 text-center"
              >
                {dealership.tagline}
              </motion.p>

              <div className="w-56 sm:w-64">
                <div className="h-0.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-honda-red via-honda-red-hover to-gold-accent rounded-full loader-shine"
                    style={{ width: `${displayProgress}%` }}
                  />
                </div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55 }}
                  className="text-center text-xs text-silver/60 mt-3 tabular-nums"
                >
                  {displayProgress}%
                </motion.p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="absolute bottom-10 text-silver/40 text-xs tracking-widest uppercase"
            >
              {dealership.name}
            </motion.div>

            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-honda-red/50 to-transparent loader-scan" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
