"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, Phone, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { getDealership, getNavigation } from "@/lib/data";
import { formatPhone } from "@/lib/format";
import { cn } from "@/lib/utils";
import { QuoteDialog } from "./quote-dialog";
import { Logo } from "./logo";

const dealership = getDealership();
const navigation = getNavigation();

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  const isHome = pathname === "/";

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled || !isHome
          ? "bg-charcoal/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Logo />

          <nav className="hidden lg:flex items-center gap-1">
            {navigation.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    className={cn(
                      "flex items-center gap-1 px-3 py-2 text-sm text-white/90 hover:text-white transition-colors rounded-lg hover:bg-white/10",
                      pathname.startsWith(item.href) && "text-honda-red"
                    )}
                  >
                    {item.label}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  {openDropdown === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full left-0 mt-1 w-56 bg-charcoal-light border border-white/10 rounded-xl shadow-xl py-2 overflow-hidden"
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 text-sm text-white/90 hover:text-white transition-colors rounded-lg hover:bg-white/10",
                    pathname === item.href && "text-honda-red"
                  )}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${dealership.hotline}`}
              className="hidden md:flex items-center gap-2 text-white hover:text-honda-red transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm font-semibold">
                {formatPhone(dealership.hotline)}
              </span>
            </a>
            <QuoteDialog
              trigger={
                <Button size="sm" className="hidden sm:inline-flex bg-honda-red hover:bg-honda-red-hover text-white border-0">
                  Báo giá
                </Button>
              }
            />
            <Sheet>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden text-white hover:bg-white/10"
                  >
                    <Menu className="w-5 h-5" />
                  </Button>
                }
              />
              <SheetContent side="right" className="bg-charcoal border-white/10 w-80 p-0">
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <span className="text-white font-bold">Menu</span>
                  <SheetClose
                    render={
                      <Button variant="ghost" size="icon" className="text-white">
                        <X className="w-5 h-5" />
                      </Button>
                    }
                  />
                </div>
                <nav className="p-4 space-y-1">
                  {navigation.map((item) => (
                    <div key={item.label}>
                      <Link
                        href={item.href}
                        className="block px-3 py-2.5 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      >
                        {item.label}
                      </Link>
                      {item.children && (
                        <div className="ml-4 space-y-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block px-3 py-2 text-sm text-white/60 hover:text-white transition-colors"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>
                <div className="p-4 border-t border-white/10">
                  <a
                    href={`tel:${dealership.hotline}`}
                    className="flex items-center gap-2 text-honda-red font-semibold"
                  >
                    <Phone className="w-4 h-4" />
                    {formatPhone(dealership.hotline)}
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
