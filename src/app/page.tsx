import Carousel from "./components/carousel";
import Hero from "./components/hero";
import Timeline from "./components/timeline";
import Closet from "./pages/clothes";

export default function Home() {
  return (
    <div>
      <Hero/>
      <Carousel/>
      <Timeline/>
      <Closet/>
    </div>
    )
}
