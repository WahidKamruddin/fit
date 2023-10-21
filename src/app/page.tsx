import Hero from "./components/hero";
import Outfit from "./components/outfit";
import Timeline from "./components/timeline";
import Wardrobe from "./components/wardrobe";
import Closet from "./pages/clothes";

export default function Home() {
  return (
    <div>
      <Hero/>
      <Wardrobe/>
      <Outfit/>
      <Timeline/>
      <Closet/>
    </div>
    )
}
