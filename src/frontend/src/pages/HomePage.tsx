import Footer from "@/components/Footer";
import NavOverlay from "@/components/NavOverlay";
import AboutSection from "@/sections/AboutSection";
import BrandStripSection from "@/sections/BrandStripSection";
import HeroSection from "@/sections/HeroSection";
import IntroSection from "@/sections/IntroSection";
import ProductCarouselSection from "@/sections/ProductCarouselSection";

export default function HomePage() {
  return (
    <main>
      <NavOverlay />
      <HeroSection />
      <IntroSection />
      <ProductCarouselSection />
      <AboutSection />
      <BrandStripSection />
      <Footer />
    </main>
  );
}
