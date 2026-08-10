"use client";

import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { ZaloIcon } from "@/components/icons/zalo-icon";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { DealershipInfo } from "@/lib/types";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export function FloatingContact({
  dealership,
}: {
  dealership: DealershipInfo;
}) {
  const reducedMotion = useReducedMotion();

  const contacts = [
    {
      href: `tel:${dealership.hotline}`,
      icon: Phone,
      label: "Gọi điện",
      color: "bg-honda-red hover:bg-honda-red-hover",
      iconClassName: "w-5 h-5",
    },
    {
      href: dealership.social.zalo,
      icon: ZaloIcon,
      label: "Zalo",
      color: "bg-transparent hover:opacity-90 p-0",
      iconClassName: "w-12 h-12",
    },
    {
      href: dealership.social.facebookPage,
      icon: FacebookIcon,
      label: "Facebook",
      color: "bg-blue-600 hover:bg-blue-700",
      iconClassName: "w-5 h-5",
    },
  ];

  return (
    <motion.div
      initial={reducedMotion ? {} : { x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 2, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed bottom-6 right-4 z-40 flex flex-col gap-2"
    >
      {contacts.map((contact) => (
        <a
          key={contact.label}
          href={contact.href}
          target={contact.label !== "Gọi điện" ? "_blank" : undefined}
          rel={contact.label !== "Gọi điện" ? "noopener noreferrer" : undefined}
          className={`${contact.color} text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110`}
          title={contact.label}
        >
          <contact.icon className={contact.iconClassName} />
        </a>
      ))}
    </motion.div>
  );
}
