import Contact from "./components/contact";
import Hero from "./components/hero";
import Timeline from "./components/timeline";
import Closet from "./(routes)/closet/page";
import Outfits from "./components/outfit";
import Wardrobe from "./components/wardrobe";
import Shop from "./components/shop";

export default function Home() {
  return (
    <div>
      <Hero/>
      <Wardrobe/>
      <hr/>
      <Outfits/>
      <hr/>
      <Shop/>
      <Timeline/>
      <Contact/>
    </div>
    )
}
