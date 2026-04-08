import ScrollReveal from "@/components/ScrollReveal";

export default function AboutSection() {
  return (
    <section id="about" data-ocid="about.section">
      {/* Light half */}
      <div className="bg-white py-20 md:py-32 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          {/* Left: Philosophy */}
          <ScrollReveal direction="left">
            <p className="text-[oklch(var(--emerald-brand))] text-xs font-sans uppercase tracking-[0.3em] mb-6">
              Who We Are
            </p>
            <blockquote className="font-serif text-3xl md:text-4xl text-[oklch(var(--foreground))] leading-tight mb-8">
              “We don’t follow trends.
              <br />
              <em>We tell stories.”</em>
            </blockquote>
            <p className="font-sans text-sm text-[oklch(var(--muted-foreground))] leading-relaxed">
              STORIES was born from a refusal to accept the ordinary. We believe
              that what you wear is the first sentence in a narrative only you
              can write. Every garment in our collection is chosen for the
              conversation it starts—not the one it ends.
            </p>
          </ScrollReveal>

          {/* Right: Mission */}
          <ScrollReveal direction="right" delay={200}>
            <p className="font-serif text-8xl text-[oklch(var(--cream-dark))] leading-none mb-4">
              01
            </p>
            <h3 className="font-serif text-2xl md:text-3xl text-[oklch(var(--foreground))] mb-4">
              Our Mission
            </h3>
            <p className="font-sans text-sm text-[oklch(var(--muted-foreground))] leading-relaxed mb-6">
              To make meaningful fashion accessible. We partner with independent
              designers and established houses alike—curation as our compass,
              integrity as our foundation.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="font-serif text-3xl text-[oklch(var(--foreground))]">
                  200+
                </p>
                <p className="font-sans text-xs text-[oklch(var(--muted-foreground))] uppercase tracking-widest mt-1">
                  Partner Brands
                </p>
              </div>
              <div>
                <p className="font-serif text-3xl text-[oklch(var(--foreground))]">
                  50K+
                </p>
                <p className="font-sans text-xs text-[oklch(var(--muted-foreground))] uppercase tracking-widest mt-1">
                  Happy Clients
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Dark half */}
      <div className="bg-[oklch(var(--dark-warm))] py-20 md:py-28 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="font-serif text-3xl md:text-5xl text-white leading-tight mb-12">
              Since 2020, STORIES has dressed
              <br />
              <em>the unapologetically individual.</em>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="flex flex-col md:flex-row justify-center gap-12 md:gap-20">
              {[
                { value: "200+", label: "Brands" },
                { value: "50K+", label: "Customers" },
                { value: "100%", label: "Curated" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-serif text-4xl text-white mb-2">
                    {stat.value}
                  </p>
                  <p className="font-sans text-xs text-white/40 uppercase tracking-[0.25em]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
