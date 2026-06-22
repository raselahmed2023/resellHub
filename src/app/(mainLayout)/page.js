import HeroBanner from "@/components/HeroBanner";
import SustainabilityImpact from "@/components/SustainabilityImpact";


export const metadata = {
  title: " ReSell Hub",
  description: "",
};

export default function Home() {
  return (
    <div >
     <HeroBanner></HeroBanner>
     <SustainabilityImpact></SustainabilityImpact>
    </div>
  );
}
