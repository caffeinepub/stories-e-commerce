import ScrollReveal from "@/components/ScrollReveal";
import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

export default function IntroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="discover"
      className="bg-white py-20 md:py-32 px-6"
      data-ocid="intro.section"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        {/* Left: video */}
        <ScrollReveal
          direction="left"
          className="rounded-2xl overflow-hidden shadow-luxury-lg"
        >
          <div className="relative aspect-video rounded-2xl overflow-hidden">
            <video
              ref={videoRef}
              muted
              loop
              playsInline
              preload="none"
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[oklch(var(--dark-warm)/0.08)]" />
          </div>
        </ScrollReveal>

        {/* Right: content */}
        <ScrollReveal direction="right" delay={150}>
          <p className="text-[oklch(var(--muted-foreground))] text-xs font-sans uppercase tracking-[0.3em] mb-4">
            Discover
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-[oklch(var(--foreground))] leading-tight mb-6">
            Curated for
            <br />
            <em>Your Story</em>
          </h2>
          <p className="font-sans text-[oklch(var(--muted-foreground))] leading-relaxed mb-8 text-sm md:text-base">
            Every piece we carry is chosen with intention. Our curation reflects
            your most authentic self—bold where you want to be bold, quiet where
            you need silence. This is fashion that speaks your language.
          </p>
          <div className="flex flex-col gap-3 items-start">
            <Link
              to="/quiz"
              className="inline-flex items-center gap-2 bg-[oklch(var(--foreground))] text-white px-8 py-4 rounded-full font-sans text-sm hover:-translate-y-1 hover:shadow-luxury-lg transition-all duration-300"
              data-ocid="intro.primary_button"
            >
              Find What Suits You
            </Link>
            <Link
              to="/survey"
              className="inline-flex items-center gap-2 border border-[oklch(var(--foreground))] text-[oklch(var(--foreground))] bg-transparent px-8 py-4 rounded-full font-sans text-sm hover:bg-[oklch(var(--foreground))] hover:text-white transition-all duration-300"
              data-ocid="intro.secondary_button"
            >
              Take Our Style Survey
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
