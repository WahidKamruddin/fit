import Contact from "./components/contact";
import Hero from "./components/hero";
import Timeline from "./components/timeline";
import Closet from "./(routes)/closet/page";
import Outfits from "./components/aiOutfitFeature";
import Wardrobe from "./components/wardrobe";
import Shop from "./components/shop";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

export default function Home() {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <Wardrobe/>
      <hr/>
      <Outfits/>
      <hr/>
      <Shop/>
      <Timeline/>
      <Contact/>
      <Footer/>
    </div>
    )
}
