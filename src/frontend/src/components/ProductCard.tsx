import type { Product } from "@/backend";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ProductCardProps {
  product: Product;
  className?: string;
  "data-ocid"?: string;
}

export default function ProductCard({
  product,
  className,
  "data-ocid": dataOcid,
}: ProductCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isHovered && !isMobile) {
      video.src = product.videoUrl;
      video.play().catch(() => {});
    } else if (!isHovered) {
      video.pause();
      video.src = "";
    }
  }, [isHovered, product.videoUrl, isMobile]);

  const imageUrl = product.image.getDirectURL();

  return (
    <Link to="/product/$id" params={{ id: product.id }} data-ocid={dataOcid}>
      <div
        className={cn(
          "product-card group relative w-72 md:w-80 flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer hover-glow-emerald border border-transparent",
          className,
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image layer */}
        <div className="relative aspect-[4/5] bg-[oklch(var(--card-warm))]">
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            className={cn(
              "product-card-image w-full h-full object-cover",
              isHovered && "opacity-0",
            )}
          />
          {/* Video layer */}
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="none"
            className={cn(
              "product-card-video absolute inset-0 w-full h-full object-cover",
              isHovered ? "opacity-100" : "opacity-0",
            )}
          />
          {/* Play indicator */}
          {product.videoUrl && !isHovered && (
            <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
              <Play className="w-3 h-3 text-white fill-white ml-0.5" />
            </div>
          )}
          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="text-[10px] uppercase tracking-widest bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full text-[oklch(var(--foreground))] font-medium">
              {product.category}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 bg-[oklch(var(--card-warm))]">
          <h3 className="font-sans text-sm font-medium text-[oklch(var(--foreground))] truncate">
            {product.name}
          </h3>
          <p className="font-sans text-sm text-[oklch(var(--muted-foreground))] mt-0.5">
            ${product.price.toLocaleString()}
          </p>
        </div>
      </div>
    </Link>
  );
}
