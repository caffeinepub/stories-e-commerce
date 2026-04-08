import { Link } from "@tanstack/react-router";
import { SiInstagram, SiPinterest, SiX } from "react-icons/si";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(
    typeof window !== "undefined" ? window.location.hostname : "",
  );

  return (
    <footer className="bg-[oklch(var(--dark-warm))] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand column */}
          <div className="md:col-span-1">
            <h3 className="font-serif text-3xl mb-3">STORIES.</h3>
            <p className="text-white/50 text-sm font-sans leading-relaxed">
              The Art of Living. Curated pieces for the unapologetically
              individual.
            </p>
            <div className="flex gap-3 mt-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <SiInstagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <SiX className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <SiPinterest className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-white/40 text-xs uppercase tracking-widest font-sans mb-4">
              Collections
            </h4>
            <ul className="space-y-3">
              {[
                "New Arrivals",
                "Womenswear",
                "Menswear",
                "Accessories",
                "Sale",
              ].map((item) => (
                <li key={item}>
                  <Link
                    to="/"
                    className="text-white/60 text-sm font-sans hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-white/40 text-xs uppercase tracking-widest font-sans mb-4">
              Brand
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Our Story", to: "/" },
                { label: "Style Quiz", to: "/quiz" },
                { label: "Sustainability", to: "/" },
                { label: "Contact", to: "/" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-white/60 text-sm font-sans hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white/40 text-xs uppercase tracking-widest font-sans mb-4">
              Stay Updated
            </h4>
            <p className="text-white/50 text-sm font-sans mb-4">
              New arrivals, exclusive edits, and quiet dispatches.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[oklch(var(--emerald-brand))] transition-colors font-sans"
                data-ocid="footer.input"
              />
              <button
                type="button"
                className="bg-[oklch(var(--emerald-brand))] text-white px-4 py-2 rounded-full text-sm font-sans hover:opacity-90 transition-opacity"
                data-ocid="footer.submit_button"
              >
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs font-sans">
            &copy; {year} STORIES. All rights reserved.
          </p>
          <p className="text-white/30 text-xs font-sans">
            Built with{" "}
            <span className="text-[oklch(var(--emerald-brand))]">&#9829;</span>{" "}
            using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white/60 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
