import Blog from "@/src/app/components/blog";
import blogData from "@/src/app/data/blogs.json";

const Blogs = () => {
  return (
    <div className="min-h-screen bg-off-white-100 pt-16">

      {/* ── Page header ──────────────────────────────────────── */}
      <div className="px-4 sm:px-8 lg:px-20">
        <div className="pt-8">
          <div className="flex items-center gap-4 animate-fade-in" style={{ animationDelay: '0.05s' }}>
            <span className="text-[10px] text-mocha-400 tracking-[0.5em] uppercase">Library</span>
            <div className="w-8 h-px bg-mocha-300" />
            <span className="text-[10px] text-mocha-400 tracking-[0.5em] uppercase">
              {blogData.length} {blogData.length === 1 ? 'article' : 'articles'}
            </span>
          </div>

          <h1
            className="mt-3 font-cormorant font-light text-mocha-500 leading-[0.95] animate-fade-in-up"
            style={{ fontSize: 'clamp(2.8rem, 5vw, 9rem)', animationDelay: '0.15s' }}
          >
            Style<br />
            <span className="italic text-mocha-400">Journal.</span>
          </h1>

          <div className="mt-6 h-px bg-mocha-200 animate-fade-in" style={{ animationDelay: '0.3s' }} />
        </div>
      </div>

      {/* ── Blog list ─────────────────────────────────────────── */}
      <div className="px-4 sm:px-8 lg:px-20 pb-20 divide-y divide-mocha-200">
        {blogData.map((someBlog, i) => (
          <Blog
            key={someBlog.id}
            title={someBlog.title}
            date={someBlog.date}
            content={someBlog.content}
            index={i}
          />
        ))}
      </div>
    </div>
  );
};

export default Blogs;
