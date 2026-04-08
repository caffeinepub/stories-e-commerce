import type { EcommerceStats, Product } from "@/backend";
import { SAMPLE_PRODUCTS } from "@/data/sampleProducts";
import { useActor } from "@/hooks/useActor";
import { useQuery } from "@tanstack/react-query";

export function useProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return SAMPLE_PRODUCTS;
      const products = await actor.getProducts();
      return products.length > 0 ? products : SAMPLE_PRODUCTS;
    },
    enabled: !!actor && !isFetching,
    initialData: SAMPLE_PRODUCTS,
  });
}

export function useFeaturedProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["featured-products"],
    queryFn: async () => {
      if (!actor) return SAMPLE_PRODUCTS.filter((p) => p.featured);
      const products = await actor.getFeaturedProducts();
      return products.length > 0
        ? products
        : SAMPLE_PRODUCTS.filter((p) => p.featured);
    },
    enabled: !!actor && !isFetching,
    initialData: SAMPLE_PRODUCTS.filter((p) => p.featured),
  });
}

export function useRecommendations() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["recommendations"],
    queryFn: async () => {
      if (!actor) return SAMPLE_PRODUCTS.slice(0, 4);
      const products = await actor.getMyRecommendations();
      return products.length > 0 ? products : SAMPLE_PRODUCTS.slice(0, 4);
    },
    enabled: !!actor && !isFetching,
    initialData: SAMPLE_PRODUCTS.slice(0, 4),
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["is-admin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
    initialData: false,
  });
}

export function useStats() {
  const { actor, isFetching } = useActor();
  return useQuery<EcommerceStats>({
    queryKey: ["stats"],
    queryFn: async () => {
      if (!actor)
        return {
          totalProducts: BigInt(0),
          totalOrders: BigInt(0),
          featuredProducts: BigInt(0),
        };
      return actor.getStats();
    },
    enabled: !!actor && !isFetching,
    initialData: {
      totalProducts: BigInt(0),
      totalOrders: BigInt(0),
      featuredProducts: BigInt(0),
    },
  });
}
