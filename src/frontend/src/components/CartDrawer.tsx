import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/hooks/useQueries";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cartItems, removeFromCart } = useCart();
  const { data: products } = useProducts();

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

  const getProduct = (productId: string) =>
    products?.find((p) => p.id === productId);

  const subtotal = cartItems.reduce((sum, item) => {
    const product = getProduct(item.productId);
    return sum + (product?.price ?? 0) * Number(item.quantity);
  }, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.32, 0, 0.67, 0] }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[oklch(var(--cream))] z-50 flex flex-col shadow-luxury-lg"
            data-ocid="cart.panel"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[oklch(var(--border))]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                <span className="font-sans font-medium text-lg">Your Cart</span>
                {cartItems.length > 0 && (
                  <span className="bg-[oklch(var(--emerald-brand))] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-[oklch(var(--border))] hover:bg-[oklch(var(--cream-dark))] transition-colors"
                data-ocid="cart.close_button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cartItems.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center h-full text-center"
                  data-ocid="cart.empty_state"
                >
                  <ShoppingBag className="w-12 h-12 text-[oklch(var(--muted-foreground))] mb-4" />
                  <p className="font-sans text-[oklch(var(--muted-foreground))]">
                    Your cart is empty
                  </p>
                  <p className="font-sans text-sm text-[oklch(var(--muted-foreground))] mt-1">
                    Discover pieces that tell your story
                  </p>
                </div>
              ) : (
                cartItems.map((item, i) => {
                  const product = getProduct(item.productId);
                  if (!product) return null;
                  return (
                    <div
                      key={item.productId}
                      className="flex gap-4 p-4 bg-[oklch(var(--cream-dark))] rounded-xl"
                      data-ocid={`cart.item.${i + 1}`}
                    >
                      <img
                        src={product.image.getDirectURL()}
                        alt={product.name}
                        className="w-20 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-sans text-sm font-medium truncate">
                          {product.name}
                        </h4>
                        <p className="font-sans text-xs text-[oklch(var(--muted-foreground))] mt-0.5">
                          {item.selectedVariant}
                        </p>
                        <p className="font-sans text-sm font-medium mt-2">
                          ${product.price.toLocaleString()}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-2 border border-[oklch(var(--border))] rounded-full px-3 py-1">
                            <Minus className="w-3 h-3" />
                            <span className="text-sm w-4 text-center">
                              {Number(item.quantity)}
                            </span>
                            <Plus className="w-3 h-3" />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.productId)}
                            className="text-[oklch(var(--muted-foreground))] hover:text-destructive transition-colors"
                            data-ocid={`cart.delete_button.${i + 1}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-[oklch(var(--border))]">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-sans text-sm text-[oklch(var(--muted-foreground))]">
                    Subtotal
                  </span>
                  <span className="font-sans font-medium text-lg">
                    ${subtotal.toLocaleString()}
                  </span>
                </div>
                <Button
                  className="w-full rounded-full bg-[oklch(var(--foreground))] text-[oklch(var(--cream))] hover:bg-[oklch(var(--emerald-brand))] transition-colors h-12 font-sans tracking-wide uppercase text-xs"
                  data-ocid="cart.submit_button"
                >
                  Proceed to Checkout
                </Button>
                <p className="text-center text-xs text-[oklch(var(--muted-foreground))] mt-3 font-sans">
                  Shipping & taxes calculated at checkout
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
