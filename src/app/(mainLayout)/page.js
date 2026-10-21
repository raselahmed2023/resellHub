import HeroBanner from "@/components/HeroBanner";
import FeaturedProducts from "./home/FeaturedProducts";
import MarketplaceStats from "./home/MarketplaceStats";
import HomeEcosystem from "@/components/HomeEcosystem";
import HomeReuseImpact from "@/components/HomeReuseImpact";

export const metadata = {
  title: "ReSellHub | Buy Smarter, Reuse Better",
  description:
    "A Bangladesh-focused second-hand marketplace built around affordability, community, reuse and smarter local resale.",
};

export default function Home() {
  return (
    <main>
      <HeroBanner />

      <FeaturedProducts />

      <HomeEcosystem />

      <MarketplaceStats />

      <HomeReuseImpact />
    </main>
  );
}