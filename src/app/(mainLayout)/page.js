import HeroBanner from "@/components/HeroBanner";
import SustainabilityImpact from "@/components/SustainabilityImpact";
import FeaturedProducts from "./home/FeaturedProducts";
import PopularCategories from "./home/PopularCategories";
import MarketplaceStats from "./home/MarketplaceStats";
import SuccessStories from "@/components/SuccessStories";
import TrustedSellersShowcase from "@/components/TrustedSellersShowcase";
import ReSellGuide from "@/components/ReSellGuide";

export const metadata = {
  title: "ReSellHub | Buy & Sell Pre-Owned Products",
  description:
    "Buy and sell pre-owned products on ReSellHub. Discover useful products, give items a second life, and connect with buyers and sellers.",
};

export default function Home() {
  return (
    <div>
      <HeroBanner />
      <FeaturedProducts />
      <PopularCategories />
      <SuccessStories />
      <MarketplaceStats />
      <SustainabilityImpact />
      <TrustedSellersShowcase />
      <ReSellGuide />
    </div>
  );
}