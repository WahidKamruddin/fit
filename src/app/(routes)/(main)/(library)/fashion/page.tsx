const FashionPage = () => {
  return (
    <div className="fashion-page pt-24 px-36 w-full h-screen">
      <h1 className="text-4xl font-bold text-center mb-12">Fashion Education</h1>

      {/* Section 1: What is Fashion? */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">What is Fashion?</h2>
        <p>Fashion is more than just clothes. It's a creative expression that reflects culture, identity, and personality. Fashion has evolved throughout history, influenced by social, political, and technological shifts. It’s an art form that communicates who you are, your values, and how you wish to present yourself to the world.</p>
        
        <p><strong>Fashion vs. Style:</strong> While fashion refers to the trends and designs that dominate society, style is the way you interpret and express those trends. It's how you wear your clothes and make them your own.</p>
        
        <p>Fashion can empower you, enhance your confidence, and even serve as a platform for social change. In today’s digital world, fashion is no longer just about what’s on the runway, but what’s being worn on the streets, in social media, and through apps like ours.</p>
      </section>

      {/* Section 2: Color Theory */}
      <section className="mt-10">
        <h2 className="text-3xl font-semibold mb-4">Color Theory for Fashion</h2>
        <p><strong>The Color Wheel:</strong> The color wheel is a tool that shows how colors are related. Colors are divided into primary (red, blue, yellow), secondary (orange, green, purple), and tertiary colors. Understanding the color wheel helps you create outfits that are visually pleasing.</p>

        <p><strong>Color Harmonies:</strong> </p> 
          <ul>
            <li><strong>Complementary Colors:</strong> These are opposite each other on the wheel, like red and green. They create vibrant contrasts, but be careful with how you use them.</li>
            <li><strong>Analogous Colors:</strong> These colors are next to each other on the wheel, like blue, blue-green, and green. They create harmony and are soothing to the eye.</li>
            <li><strong>Triadic Colors:</strong> Three evenly spaced colors, like red, yellow, and blue. These are balanced but vibrant.</li>
          </ul>

        <p><strong>Cool vs. Warm Tones:</strong></p>
        <ul>
          <li><strong>Cool Colors:</strong> Blues, greens, and purples. These colors can be calming and elegant.</li>
          <li><strong>Warm Colors:</strong> Reds, oranges, and yellows. These colors are energetic, warm, and often make you stand out.</li>
        </ul>

        <p><strong>Neutrals & Accent Colors:</strong> Neutral tones (black, white, grey, beige) are your foundation. They can be paired with any color and are versatile. Accent colors, like a bright scarf or shoes, can bring a pop of personality to your outfits.</p>
      </section>

      {/* Section 3: Understanding Fit & Proportions */}
      <section className="mt-10">
        <h2 className="text-3xl font-semibold mb-4">Understanding Fit & Proportions</h2>
        <p>Fit is everything. A well-fitted garment will enhance your body and your confidence, while a poor fit can throw off your entire look. Key areas to focus on include:</p>
        <ul>
          <li><strong>Shoulders:</strong> The seam should sit right at the edge of your shoulder.</li>
          <li><strong>Waist:</strong> Pants or skirts should fit comfortably around your waist without being too tight or too loose.</li>
          <li><strong>Length:</strong> Clothes should hit you at the right points. For example, jeans should sit just above your shoes, and sleeves should end at the wrist bone.</li>
        </ul>

        <p><strong>Body Types and Fit:</strong> Understanding your body shape will help you choose clothing that accentuates your best features. Popular body types include:</p>
        <ul>
          <li><strong>Hourglass:</strong> Well-defined waist with balanced hips and bust.</li>
          <li><strong>Pear:</strong> Wider hips and thighs, narrower upper body.</li>
          <li><strong>Apple:</strong> Broader upper body and narrower hips.</li>
          <li><strong>Rectangle:</strong> Balanced shoulders, waist, and hips.</li>
        </ul>
      </section>

      {/* Section 4: Wardrobe Essentials */}
      <section className="mt-10">
        <h2 className="text-3xl font-semibold mb-4">Wardrobe Essentials</h2>
        <p>Every wardrobe should have a set of essential items that can be mixed and matched for various occasions. These are classic pieces that never go out of style:</p>
        <ul>
          <li><strong>For Women:</strong> Little black dress, tailored blazer, white button-up shirt, dark jeans, ballet flats, versatile handbag.</li>
          <li><strong>For Men:</strong> Classic suit, white dress shirt, chinos, well-fitted t-shirt, quality jeans, leather shoes.</li>
        </ul>

        <p>A capsule wardrobe is a collection of versatile pieces that work together. Focus on quality over quantity, and choose colors and cuts that flatter your body type.</p>
      </section>

      {/* Section 5: Fabrics & Textures */}
      <section className="mt-10">
        <h2 className="text-3xl font-semibold mb-4">Fabrics & Textures</h2>
        <p>Each fabric brings its own look and feel. Here are some common ones:</p>
        <ul>
          <li><strong>Cotton:</strong> Soft, breathable, and perfect for summer.</li>
          <li><strong>Linen:</strong> Lightweight and ideal for warm weather, though it wrinkles easily.</li>
          <li><strong>Wool:</strong> Warm and insulating, great for cold weather.</li>
          <li><strong>Denim:</strong> Durable and timeless, works for casual and semi-casual outfits.</li>
        </ul>

        <p>Mixing textures (smooth leather with soft wool, or rough denim with silk) adds depth and interest to your outfits. Always consider the season and comfort when choosing fabrics.</p>
      </section>

      {/* Section 6: Outfit Composition Tips */}
      <section className="mt-10">
        <h2 className="text-3xl font-semibold mb-4">Outfit Composition Tips</h2>
        <p><strong>The Rule of 3:</strong> When putting together an outfit, think in threes: combine colors, textures, and accessories. This creates balance and avoids overwhelming the eye.</p>

        <p><strong>Mixing Patterns:</strong> Mixing patterns can be tricky. Start with patterns that share a common color or that are in complementary scales (like stripes with florals). If you’re uncertain, start small—one patterned piece and one solid piece.</p>

        <p><strong>Accessorizing:</strong> Accessories are the finishing touch. They can transform an outfit. Consider belts, scarves, jewelry, hats, and shoes. Accessories should complement your look, not overpower it.</p>
      </section>
    </div>
  );
};

export default FashionPage;
