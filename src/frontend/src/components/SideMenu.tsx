import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { motion } from "motion/react";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuLinks = [
  { label: "New Arrivals", to: "/" },
  { label: "Womenswear", to: "/" },
  { label: "Menswear", to: "/" },
  { label: "Accessories", to: "/" },
  { label: "About", to: "/" },
  { label: "Style Quiz", to: "/quiz" },
];

import { AnimatePresence } from "motion/react";
import { useEffect, useRef } from "react";

export default function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          {/* Drawer */}
          <motion.div
            ref={menuRef}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.4, ease: [0.32, 0, 0.67, 0] }}
            className="fixed left-0 top-0 h-full w-80 bg-[oklch(var(--dark-warm))] z-50 flex flex-col"
            data-ocid="side_menu.panel"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <span className="font-serif text-2xl text-white tracking-wide">
                STORIES
              </span>
              <button
                type="button"
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
                data-ocid="side_menu.close_button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 p-6 space-y-1">
              {menuLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                >
                  <Link
                    to={link.to}
                    onClick={onClose}
                    className="block py-3 font-sans text-lg text-white/80 hover:text-white hover:pl-2 transition-all duration-200 border-b border-white/5"
                    data-ocid="side_menu.link"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Footer */}
            <div className="p-6 border-t border-white/10">
              <p className="text-white/40 text-xs font-sans tracking-widest uppercase">
                The Art of Living
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
