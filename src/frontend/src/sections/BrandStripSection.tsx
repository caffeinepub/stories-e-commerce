export default function BrandStripSection() {
  const pills = [
    {
      label: "Crafted With Intention",
      color: "bg-[oklch(var(--pastel-blush))]",
    },
    { label: "Radically Curated", color: "bg-[oklch(var(--pastel-sage))]" },
    {
      label: "Your Story, Always",
      color: "bg-[oklch(var(--pastel-champagne))]",
    },
  ];

  return (
    <section
      className="bg-white py-16 px-6 border-t border-[oklch(var(--border))]"
      data-ocid="brand-strip.section"
    >
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="font-serif text-5xl tracking-[0.08em] text-[oklch(var(--foreground))] mb-5">
          STORIES.
        </h2>
        <div className="w-24 h-px bg-[oklch(var(--border))] mx-auto mb-5" />
        <p className="font-serif italic text-sm text-[oklch(var(--muted-foreground))] tracking-wide mb-10">
          Every garment is the first sentence of a story only you can write.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {pills.map((pill) => (
            <span
              key={pill.label}
              className={`${pill.color} text-[oklch(var(--foreground))] font-sans text-xs tracking-[0.15em] uppercase px-5 py-2 rounded-full`}
            >
              {pill.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
