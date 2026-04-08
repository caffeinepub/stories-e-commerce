import ProductCard from "@/components/ProductCard";
import ScrollReveal from "@/components/ScrollReveal";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProducts } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import { useRef } from "react";

export default function ProductCarouselSection() {
  const { data: products } = useProducts();
  const isMobile = useIsMobile();
  const trackRef = useRef<HTMLDivElement>(null);

  // Double the products for seamless infinite scroll
  const doubled = [...(products ?? []), ...(products ?? [])];

  return (
    <section
      id="arrivals"
      className="py-20 md:py-28 bg-white overflow-hidden"
      data-ocid="carousel.section"
    >
      {/* Header */}
      <ScrollReveal className="text-center mb-12 px-6">
        <p className="text-[oklch(var(--muted-foreground))] text-xs font-sans uppercase tracking-[0.3em] mb-3">
          New Arrivals
        </p>
        <h2 className="font-serif text-4xl md:text-5xl text-[oklch(var(--foreground))]">
          Featured Collection
        </h2>
      </ScrollReveal>

      {/* Carousel */}
      {isMobile ? (
        // Mobile: touch scroll
        <div className="carousel-track-mobile px-4 gap-4 pb-4">
          {(products ?? []).map((product, i) => (
            <div
              key={product.id}
              className="scroll-snap-align-start flex-shrink-0"
              data-ocid={`carousel.item.${i + 1}`}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        // Desktop: auto-scroll
        <div className="relative">
          <div ref={trackRef} className="carousel-track gap-5 px-5">
            {doubled.map((product, i) => (
              <ProductCard
                key={`${product.id}-${i}`}
                product={product}
                data-ocid={
                  i < (products?.length ?? 0)
                    ? `carousel.item.${i + 1}`
                    : undefined
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* View all */}
      <ScrollReveal className="text-center mt-12 px-6">
        <Link
          to="/"
          className="inline-block border border-[oklch(var(--foreground))] text-[oklch(var(--foreground))] px-8 py-3.5 rounded-full font-sans text-xs uppercase tracking-widest hover:bg-[oklch(var(--foreground))] hover:text-[oklch(var(--cream))] transition-all duration-300"
          data-ocid="carousel.secondary_button"
        >
          View All Products
        </Link>
      </ScrollReveal>
    </section>
  );
}
