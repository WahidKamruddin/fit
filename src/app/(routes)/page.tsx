import Contact from "@/src/app/components/contact";
import Hero from "@/src/app/components/hero";
import Timeline from "@/src/app/components/timeline";
import Outfits from "@/src/app/components/ai-outfit-feature";
import Wardrobe from "@/src/app/components/wardrobe";
import Shop from "@/src/app/components/shop";
import Navbar from "@/src/app/components/navbar";
import Footer from "@/src/app/components/footer";

export default function Home() {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <Wardrobe/>
      <Outfits/>
      <Shop/>
      <Timeline/>
      <Contact/>
      <Footer/>
    </div>
    )
}
