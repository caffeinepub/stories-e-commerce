import type { CartItem } from "@/backend";
import { useActor } from "@/hooks/useActor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { toast } from "sonner";

interface CartContextValue {
  cartItemCount: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (productId: string, variant: string) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  cartItems: CartItem[];
  isLoading: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { data: cart, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCart();
    },
    enabled: !!actor && !isFetching,
  });

  const addMutation = useMutation({
    mutationFn: async ({
      productId,
      variant,
    }: { productId: string; variant: string }) => {
      if (!actor) throw new Error("Not connected");
      const item: CartItem = {
        productId,
        selectedVariant: variant,
        quantity: BigInt(1),
      };
      await actor.addToCart(item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Added to cart");
      setIsCartOpen(true);
    },
    onError: () => {
      toast.error("Failed to add to cart");
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!actor) throw new Error("Not connected");
      await actor.removeFromCart(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Removed from cart");
    },
  });

  const addToCart = useCallback(
    async (productId: string, variant: string) => {
      await addMutation.mutateAsync({ productId, variant });
    },
    [addMutation],
  );

  const removeFromCart = useCallback(
    async (productId: string) => {
      await removeMutation.mutateAsync(productId);
    },
    [removeMutation],
  );

  const cartItems = cart?.items ?? [];
  const cartItemCount = cartItems.reduce(
    (sum, item) => sum + Number(item.quantity),
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItemCount,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        addToCart,
        removeFromCart,
        cartItems,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
