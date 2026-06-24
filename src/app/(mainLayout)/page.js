import HeroBanner from "@/components/HeroBanner";
import SustainabilityImpact from "@/components/SustainabilityImpact";
import FeaturedProducts from "./home/FeaturedProducts";
import PopularCategories from "./home/PopularCategories";
import MarketplaceStats from "./home/MarketplaceStats";


export const metadata = {
  title: " ReSell Hub",
  description: "",
};

export default function Home() {
  return (
    <div >
      <HeroBanner></HeroBanner>

      <FeaturedProducts></FeaturedProducts>
      <PopularCategories></PopularCategories>
      <MarketplaceStats></MarketplaceStats>
      <SustainabilityImpact></SustainabilityImpact>
    </div>
  );
}
