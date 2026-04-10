const sections = [
  {
    num: '01',
    title: 'What is Fashion?',
    body: [
      'Fashion is more than just clothes. It\'s a creative expression that reflects culture, identity, and personality. Fashion has evolved throughout history, influenced by social, political, and technological shifts. It\'s an art form that communicates who you are, your values, and how you wish to present yourself to the world.',
      'Fashion vs. Style — While fashion refers to the trends and designs that dominate society, style is the way you interpret and express those trends. It\'s how you wear your clothes and make them your own.',
      'Fashion can empower you, enhance your confidence, and even serve as a platform for social change. In today\'s digital world, fashion is no longer just about what\'s on the runway, but what\'s being worn on the streets, in social media, and through apps like ours.',
    ],
  },
  {
    num: '02',
    title: 'Color Theory for Fashion',
    body: [
      'The Color Wheel — The color wheel is a tool that shows how colors are related. Colors are divided into primary (red, blue, yellow), secondary (orange, green, purple), and tertiary colors. Understanding the color wheel helps you create outfits that are visually pleasing.',
      'Complementary Colors are opposite each other on the wheel, like red and green — vibrant contrasts that demand attention. Analogous Colors sit next to each other, like blue, blue-green, and green — harmonious and soothing. Triadic Colors are three evenly spaced hues, balanced yet energetic.',
      'Neutrals (black, white, grey, beige) are your foundation. They pair with anything and let accent colors — a bright scarf, a bold shoe — carry the personality of the look.',
    ],
  },
  {
    num: '03',
    title: 'Fit & Proportions',
    body: [
      'Fit is everything. A well-fitted garment enhances your silhouette and your confidence, while a poor fit throws off the entire look. Shoulders should sit right at the edge; waistbands should rest comfortably; hems should fall at the right break point.',
      'Understanding your body shape helps you choose clothing that accentuates your best features. Hourglass, Pear, Apple, Rectangle — each benefits from different cuts, proportions, and silhouettes. Dress for the body you have today, not the one you\'re working toward.',
    ],
  },
  {
    num: '04',
    title: 'Wardrobe Essentials',
    body: [
      'Every wardrobe needs a foundation of versatile pieces that can be mixed and matched across occasions. These are the classics that never age: a tailored blazer, a crisp white shirt, dark denim, quality leather shoes.',
      'A capsule wardrobe is built on quality over quantity. Choose colors and cuts that flatter your body type and suit your lifestyle. When each piece works with at least three others, your wardrobe becomes effortlessly powerful.',
    ],
  },
  {
    num: '05',
    title: 'Fabrics & Textures',
    body: [
      'Each fabric has its own character. Cotton breathes in summer; linen keeps you cool but wrinkles freely; wool insulates in winter; denim is durable, timeless, and endlessly versatile.',
      'Mixing textures — smooth leather with soft wool, rough denim with silk — adds depth and visual interest to an outfit. Consider season, occasion, and comfort when choosing your fabrics. The right texture can elevate even the simplest silhouette.',
    ],
  },
  {
    num: '06',
    title: 'Outfit Composition',
    body: [
      'The Rule of Three — when composing an outfit, think in threes: colors, textures, and accessories. This creates balance without visual noise.',
      'Mixing patterns is an art. Start with patterns that share a common color, or play with scale (stripes with florals). When uncertain, anchor one pattern with a solid.',
      'Accessories are the final punctuation. A belt, scarf, watch, or pair of shoes can transform an outfit. They should complement your look — not compete with it.',
    ],
  },
];

const FashionPage = () => {
  return (
    <div className="min-h-screen bg-off-white-100 pt-16">

      {/* ── Page header ──────────────────────────────────────── */}
      <div className="px-4 sm:px-8 lg:px-20">
        <div className="pt-8">
          <div className="flex items-center gap-4 animate-fade-in" style={{ animationDelay: '0.05s' }}>
            <span className="text-[10px] text-mocha-400 tracking-[0.5em] uppercase">Library</span>
            <div className="w-8 h-px bg-mocha-300" />
            <span className="text-[10px] text-mocha-400 tracking-[0.5em] uppercase">Fashion Guide</span>
          </div>

          <h1
            className="mt-3 font-cormorant font-light text-mocha-500 leading-[0.95] animate-fade-in-up"
            style={{ fontSize: 'clamp(2.8rem, 5vw, 4.5rem)', animationDelay: '0.15s' }}
          >
            Dress with<br />
            <span className="italic text-mocha-400">Intention.</span>
          </h1>

          <p className="mt-5 text-sm text-mocha-400 leading-relaxed max-w-lg animate-fade-in" style={{ animationDelay: '0.25s' }}>
            A guide to understanding fashion from the ground up — color, fit, fabric, and composition.
          </p>

          <div className="mt-6 h-px bg-mocha-200 animate-fade-in" style={{ animationDelay: '0.3s' }} />
        </div>
      </div>

      {/* ── Sections ──────────────────────────────────────────── */}
      <div className="px-4 sm:px-8 lg:px-20 pb-24">
        {sections.map((section, i) => (
          <section
            key={section.num}
            className="py-12 border-b border-mocha-200 animate-fade-in-up"
            style={{ animationDelay: `${0.1 + i * 0.08}s` }}
          >
            <div className="flex items-start gap-8 lg:gap-16">

              {/* Section number */}
              <span className="hidden sm:block font-cormorant text-5xl font-light text-mocha-200 leading-none select-none pt-1">
                {section.num}
              </span>

              <div className="flex-1">
                <h2
                  className="font-cormorant font-light text-mocha-500 leading-tight mb-6"
                  style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)' }}
                >
                  {section.title}
                </h2>

                <div className="space-y-4">
                  {section.body.map((para, j) => (
                    <p key={j} className="text-mocha-400 text-sm leading-relaxed max-w-2xl">
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default FashionPage;
