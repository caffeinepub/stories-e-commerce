import { motion } from "motion/react";
import { useEffect, useRef } from "react";

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <section
      className="relative w-full h-screen overflow-hidden"
      data-ocid="hero.section"
    >
      {/* Background: video or gradient fallback */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        className="absolute inset-0 w-full h-full object-cover opacity-40"
        src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1814] via-[#2e2a23]/95 to-[#3d3830]" />

      {/* Subtle radial highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(108,98,87,0.3)_0%,transparent_70%)] hero-shimmer" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        {/* Season label */}
        <motion.p
          className="text-white/60 text-xs font-sans tracking-[0.4em] uppercase mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          AW’26 Collection
        </motion.p>

        {/* Brand name */}
        <motion.h1
          className="text-stories font-serif text-white leading-none tracking-[-0.02em]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          STORIES
        </motion.h1>

        {/* Sub-tagline */}
        <motion.p
          className="text-white/70 text-lg md:text-xl font-serif italic mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          The Art of Living
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-10"
        >
          <a
            href="#arrivals"
            className="inline-block border border-white/50 text-white px-10 py-3.5 rounded-full tracking-[0.25em] text-xs uppercase font-sans hover:bg-white hover:text-[#1a1814] transition-all duration-300 hover:scale-[1.03]"
            data-ocid="hero.primary_button"
          >
            Explore Now
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
      >
        <span className="text-white/40 text-[10px] font-sans tracking-widest uppercase">
          Scroll
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
      </motion.div>
    </section>
  );
}
