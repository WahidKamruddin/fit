const PageSkeleton = () => (
  <div className="min-h-screen bg-off-white-100 pt-16 px-4 sm:px-8 lg:px-20 animate-pulse">

    {/* Overline */}
    <div className="pt-8 flex items-center gap-4">
      <div className="h-2 w-20 bg-gray-300 rounded-full" />
      <div className="w-8 h-px bg-gray-300" />
      <div className="h-2 w-16 bg-gray-300 rounded-full" />
    </div>

    {/* Heading */}
    <div className="mt-5 space-y-3">
      <div className="h-10 w-48 bg-gray-400 rounded-lg" />
      <div className="h-10 w-36 bg-gray-300 rounded-lg" />
    </div>

    {/* Divider */}
    <div className="mt-6 h-px bg-gray-300" />

    {/* Filter pills / action row */}
    <div className="mt-5 flex gap-2">
      {[64, 80, 48, 72].map((w, i) => (
        <div key={i} className="h-8 rounded-full bg-gray-300" style={{ width: w }} />
      ))}
    </div>

    {/* Card grid */}
    <div className="mt-10 flex flex-wrap gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="w-44 h-44 rounded-2xl bg-gray-300" />
      ))}
    </div>
  </div>
);

export default PageSkeleton;
