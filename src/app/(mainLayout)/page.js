import HeroBanner from "@/components/HeroBanner";
import FeaturedProducts from "./home/FeaturedProducts";
import HomeEcosystem from "@/components/HomeEcosystem";
import MarketplaceStats from "./home/MarketplaceStats";
import SustainabilityImpact from "@/components/SustainabilityImpact";
import ReSellGuide from "@/components/ReSellGuide";

export const metadata = {
  title: "ReSellHub | Smarter Reuse for Bangladesh",
  description:
    "Discover affordable pre-owned products, connect with local buyers and sellers, and keep useful products in circulation through ReSellHub.",
};

export default function Home() {
  return (
    <main>
      <HeroBanner />
      <FeaturedProducts />
      <HomeEcosystem />
      <MarketplaceStats />
      <SustainabilityImpact />
      <ReSellGuide />
    </main>
  );
}