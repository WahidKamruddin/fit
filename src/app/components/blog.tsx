const Blog = ({ title, date, content, index = 0 }: { title: string; date: string; content: string; index?: number }) => {
  return (
    <article
      className="group py-16 animate-fade-in-up"
      style={{ animationDelay: `${0.1 + index * 0.1}s` }}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-5">
        <span className="text-[10px] tracking-[0.5em] uppercase text-mocha-300">{date}</span>
        <span className="text-[10px] tracking-[0.4em] uppercase text-mocha-300 hidden sm:block">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <h2
        className="font-cormorant font-light text-mocha-500 leading-[1.05] mb-5 group-hover:text-mocha-400 transition-colors duration-300"
        style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)' }}
      >
        {title}
      </h2>

      <p className="text-mocha-400 text-sm leading-relaxed max-w-2xl">
        {content}
      </p>
    </article>
  );
};

export default Blog;
