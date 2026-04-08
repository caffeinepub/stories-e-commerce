import Footer from "@/components/Footer";
import NavOverlay from "@/components/NavOverlay";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProducts, useRecommendations } from "@/hooks/useQueries";
import BrandStripSection from "@/sections/BrandStripSection";
import { Link, useParams } from "@tanstack/react-router";
import { Heart, Minus, Plus } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

interface SurveyData {
  figure: string;
  proportions: string;
  skinTone: string;
  eyeColor: string;
  hairColor: string;
  hairTexture: string;
  stylePreference: string;
  colorPalette: string;
}

type FitLabel = "BEST FOR YOU" | "OKAY FOR YOU" | "NOT IDEAL";

function computeFitScore(
  category: string,
  survey: SurveyData,
): { label: FitLabel; explanation: string } {
  const cat = category.toLowerCase();
  const style = survey.stylePreference.toLowerCase();
  const palette = survey.colorPalette.toLowerCase();

  if (
    (cat.includes("women") || cat.includes("dress")) &&
    (style.includes("romantic") || style.includes("classic"))
  ) {
    return {
      label: "BEST FOR YOU",
      explanation:
        "This piece aligns beautifully with your Classic or Romantic aesthetic and complements the warmth in your personal palette.",
    };
  }

  if (
    (cat.includes("men") || cat.includes("blazer")) &&
    (style.includes("classic") || style.includes("minimalist"))
  ) {
    return {
      label: "BEST FOR YOU",
      explanation:
        "A natural match for your refined wardrobe. The tailoring here suits your preference for clean, considered lines.",
    };
  }

  if (cat.includes("accessor") && style.includes("minimalist")) {
    return {
      label: "BEST FOR YOU",
      explanation:
        "Understated accessories are the minimalist's signature move. This piece will elevate any outfit without competing for attention.",
    };
  }

  if (
    style.includes("minimalist") &&
    (cat.includes("bold") || cat.includes("statement") || cat.includes("edgy"))
  ) {
    return {
      label: "NOT IDEAL",
      explanation:
        "This piece leans bold and expressive — it may feel at odds with your preference for clean, understated looks.",
    };
  }

  if (
    palette.includes("bold") &&
    (cat.includes("neutral") || cat.includes("basics"))
  ) {
    return {
      label: "OKAY FOR YOU",
      explanation:
        "You gravitate towards vibrant palettes — this neutral piece can anchor a bold look, but may feel understated on its own.",
    };
  }

  const styleKeywords = style.split(/[/,\s]+/);
  const matchesBroadly = styleKeywords.some(
    (kw) => cat.includes(kw) || kw.includes(cat.split("/")[0]),
  );

  if (matchesBroadly) {
    return {
      label: "BEST FOR YOU",
      explanation:
        "Based on your style profile, this piece aligns well with your aesthetic and complements your personal palette.",
    };
  }

  return {
    label: "OKAY FOR YOU",
    explanation:
      "This piece can work for you — try pairing it with key pieces from your existing wardrobe to see if it fits your story.",
  };
}

function FitRecommendation({ category }: { category: string }) {
  const survey = useMemo<SurveyData | null>(() => {
    try {
      const raw = localStorage.getItem("stories_style_survey");
      return raw ? (JSON.parse(raw) as SurveyData) : null;
    } catch {
      return null;
    }
  }, []);

  if (!survey) return null;

  const { label, explanation } = computeFitScore(category, survey);

  const config: Record<
    FitLabel,
    { bg: string; pill: string; pillText: string }
  > = {
    "BEST FOR YOU": {
      bg: "bg-[oklch(0.95_0.025_15)]",
      pill: "bg-[oklch(var(--pastel-blush))]",
      pillText: "text-[oklch(var(--foreground))]",
    },
    "OKAY FOR YOU": {
      bg: "bg-[oklch(0.96_0.025_85)]",
      pill: "bg-[oklch(var(--pastel-champagne))]",
      pillText: "text-[oklch(var(--foreground))]",
    },
    "NOT IDEAL": {
      bg: "bg-[oklch(0.95_0.004_60)]",
      pill: "bg-[oklch(0.88_0.006_60)]",
      pillText: "text-[oklch(var(--muted-foreground))]",
    },
  };

  const { bg, pill, pillText } = config[label];

  return (
    <div
      className={`${bg} rounded-2xl p-5 border border-[oklch(var(--border))]`}
      data-ocid="product.panel"
    >
      <div className="flex items-start gap-3">
        <span
          className={`${pill} ${pillText} text-[10px] font-sans uppercase tracking-[0.18em] px-3 py-1.5 rounded-full shrink-0 mt-0.5`}
        >
          {label}
        </span>
        <div>
          <p className="font-sans text-xs text-[oklch(var(--muted-foreground))] leading-relaxed">
            {explanation}
          </p>
          <Link
            to="/survey"
            className="font-sans text-xs text-[oklch(var(--foreground))] underline underline-offset-2 mt-2 inline-block hover:opacity-60 transition-opacity"
            data-ocid="product.link"
          >
            Update Survey →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ProductPage() {
  const { id } = useParams({ from: "/product/$id" });
  const { data: products } = useProducts();
  const { data: recommendations } = useRecommendations();
  const { addToCart } = useCart();
  const isMobile = useIsMobile();

  const product = products?.find((p) => p.id === id) ?? products?.[0];
  const [selectedVariant, setSelectedVariant] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (product?.variants?.length) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isHovered && !isMobile) {
      video.src = product?.videoUrl ?? "";
      video.play().catch(() => {});
    } else if (!isHovered) {
      video.pause();
      video.src = "";
    }
  }, [isHovered, product, isMobile]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAddingToCart(true);
    try {
      await addToCart(product.id, selectedVariant || "One Size");
    } finally {
      setAddingToCart(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="font-sans text-[oklch(var(--muted-foreground))]">
          Product not found
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <NavOverlay />

      <div className="pt-24 pb-4 px-6 max-w-7xl mx-auto">
        <nav className="flex items-center gap-2 text-xs font-sans text-[oklch(var(--muted-foreground))]">
          <Link
            to="/"
            className="hover:text-[oklch(var(--foreground))] transition-colors"
          >
            Home
          </Link>
          <span>/</span>
          <span className="capitalize">{product.category}</span>
          <span>/</span>
          <span className="text-[oklch(var(--foreground))] truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>
      </div>

      <section className="px-6 py-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 items-start">
          <div
            className="relative rounded-2xl overflow-hidden cursor-pointer group"
            style={{ minHeight: "60vh" }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            data-ocid="product.canvas_target"
          >
            <img
              src={product.image.getDirectURL()}
              alt={product.name}
              className={`w-full h-full object-cover transition-opacity duration-500 ${
                isHovered && !isMobile ? "opacity-0" : "opacity-100"
              }`}
              style={{ minHeight: "60vh" }}
            />
            <video
              ref={videoRef}
              muted
              loop
              playsInline
              preload="none"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                isHovered && !isMobile ? "opacity-100" : "opacity-0"
              }`}
            />
            {!isMobile && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="glassmorphic rounded-full px-4 py-2 text-white text-xs font-sans tracking-widest">
                  HOVER TO PREVIEW
                </div>
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-28 space-y-6">
            <div>
              <span className="text-[oklch(var(--muted-foreground))] text-xs font-sans uppercase tracking-widest">
                {product.category}
              </span>
              <h1 className="font-serif text-3xl md:text-4xl text-[oklch(var(--foreground))] mt-2 leading-tight">
                {product.name}
              </h1>
              <p className="font-sans text-2xl font-medium mt-3 text-[oklch(var(--foreground))]">
                ${product.price.toLocaleString()}
              </p>
            </div>

            <p className="font-sans text-sm text-[oklch(var(--muted-foreground))] leading-relaxed">
              {product.description}
            </p>

            <FitRecommendation category={product.category} />

            {product.variants.length > 1 && (
              <div>
                <p className="font-sans text-xs uppercase tracking-widest text-[oklch(var(--muted-foreground))] mb-3">
                  Size
                </p>
                <div
                  className="flex flex-wrap gap-2"
                  data-ocid="product.select"
                >
                  {product.variants.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2 rounded-full border text-sm font-sans transition-all duration-200 ${
                        selectedVariant === v
                          ? "bg-[oklch(var(--foreground))] border-[oklch(var(--foreground))] text-white"
                          : "border-[oklch(var(--border))] text-[oklch(var(--foreground))] hover:border-[oklch(var(--foreground))]"
                      }`}
                      data-ocid="product.toggle"
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="font-sans text-xs uppercase tracking-widest text-[oklch(var(--muted-foreground))] mb-3">
                Quantity
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 border border-[oklch(var(--border))] rounded-full px-4 py-2">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-6 h-6 flex items-center justify-center text-[oklch(var(--foreground))] hover:opacity-60 transition-opacity"
                    data-ocid="product.secondary_button"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-sans text-sm w-6 text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-6 h-6 flex items-center justify-center text-[oklch(var(--foreground))] hover:opacity-60 transition-opacity"
                    data-ocid="product.secondary_button"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="w-full h-14 rounded-full bg-[oklch(var(--foreground))] text-white hover:opacity-80 transition-all duration-300 font-sans tracking-widest text-xs uppercase"
                  data-ocid="product.primary_button"
                >
                  {addingToCart ? "Adding..." : "Add to Cart"}
                </Button>
              </motion.div>
              <Button
                variant="outline"
                className="w-full h-12 rounded-full border-[oklch(var(--border))] font-sans text-xs uppercase tracking-widest hover:border-[oklch(var(--foreground))] transition-all"
                data-ocid="product.secondary_button"
              >
                <Heart className="w-4 h-4 mr-2" />
                Save to Wishlist
              </Button>
            </div>

            <div className="border-t border-[oklch(var(--border))] pt-6 space-y-3">
              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer font-sans text-sm text-[oklch(var(--foreground))] py-2 hover:opacity-60 transition-opacity">
                  Material & Care
                  <span className="group-open:rotate-180 transition-transform text-lg">
                    +
                  </span>
                </summary>
                <p className="font-sans text-sm text-[oklch(var(--muted-foreground))] leading-relaxed pt-2 pb-4">
                  Dry clean only. Store flat in the provided garment bag. Handle
                  with the same reverence you give to anything worth keeping.
                </p>
              </details>
              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer font-sans text-sm text-[oklch(var(--foreground))] py-2 hover:opacity-60 transition-opacity">
                  Shipping & Returns
                  <span className="group-open:rotate-180 transition-transform text-lg">
                    +
                  </span>
                </summary>
                <p className="font-sans text-sm text-[oklch(var(--muted-foreground))] leading-relaxed pt-2 pb-4">
                  Complimentary express shipping on all orders. Returns accepted
                  within 14 days in original condition.
                </p>
              </details>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 max-w-7xl mx-auto">
        <h2 className="font-serif text-3xl text-[oklch(var(--foreground))] mb-8">
          Recommended for You
        </h2>
        <div
          className={`grid gap-6 ${
            isMobile
              ? "grid-cols-1"
              : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          }`}
        >
          {recommendations
            ?.filter((r) => r.id !== product.id)
            .slice(0, 4)
            .map((rec, i) => (
              <ProductCard
                key={rec.id}
                product={rec}
                data-ocid={`product.item.${i + 1}`}
              />
            ))}
        </div>
      </section>

      <BrandStripSection />
      <Footer />
    </main>
  );
}
