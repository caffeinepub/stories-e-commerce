import CartDrawer from "@/components/CartDrawer";
import SideMenu from "@/components/SideMenu";
import { useCart } from "@/context/CartContext";
import { Link } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

export default function NavOverlay() {
  const { cartItemCount, isCartOpen, openCart, closeCart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />

      {/* Nav bar */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-30 transition-all duration-500 ${
          isScrolled
            ? "bg-[oklch(var(--cream)/0.9)] backdrop-blur-md shadow-xs border-b border-[oklch(var(--border))]"
            : "bg-transparent"
        }`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left: hamburger */}
          <motion.button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className={`w-11 h-11 flex items-center justify-center rounded-full transition-all duration-300 ${
              isScrolled
                ? "border border-[oklch(var(--border))] hover:bg-[oklch(var(--cream-dark))]"
                : "glassmorphic hover:bg-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            }`}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            data-ocid="nav.open_modal_button"
          >
            <Menu
              className={`w-4 h-4 ${isScrolled ? "text-[oklch(var(--foreground))]" : "text-white"}`}
            />
          </motion.button>

          {/* Center: brand name on scroll */}
          {isScrolled && (
            <Link to="/" className="absolute left-1/2 -translate-x-1/2">
              <span className="font-serif text-2xl tracking-wide text-[oklch(var(--foreground))]">
                STORIES
              </span>
            </Link>
          )}

          {/* Right: search + cart */}
          <div className="flex items-center gap-2">
            <motion.button
              type="button"
              className={`w-11 h-11 flex items-center justify-center rounded-full transition-all duration-300 ${
                isScrolled
                  ? "border border-[oklch(var(--border))] hover:bg-[oklch(var(--cream-dark))]"
                  : "glassmorphic hover:bg-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              }`}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              data-ocid="nav.button"
            >
              <Search
                className={`w-4 h-4 ${isScrolled ? "text-[oklch(var(--foreground))]" : "text-white"}`}
              />
            </motion.button>

            <motion.button
              type="button"
              onClick={openCart}
              className={`w-11 h-11 flex items-center justify-center rounded-full transition-all duration-300 relative ${
                isScrolled
                  ? "border border-[oklch(var(--border))] hover:bg-[oklch(var(--cream-dark))]"
                  : "glassmorphic hover:bg-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              }`}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              data-ocid="nav.open_modal_button"
            >
              <ShoppingBag
                className={`w-4 h-4 ${isScrolled ? "text-[oklch(var(--foreground))]" : "text-white"}`}
              />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[oklch(var(--emerald-brand))] text-white text-[10px] rounded-full flex items-center justify-center font-sans">
                  {cartItemCount}
                </span>
              )}
            </motion.button>
          </div>
        </div>
      </motion.header>
    </>
  );
}
