export function LoadingSkeleton() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-7 w-36 bg-white/20 rounded-lg mb-2" />
          <div className="h-4 w-10 bg-white/10 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-10 bg-white/10 rounded-full" />
          <div className="h-10 w-10 bg-white/10 rounded-full" />
        </div>
      </div>

      {/* Search bar */}
      <div className="h-10 w-full bg-white/10 rounded-full mb-6" />

      {/* Two-column grid */}
      <div className="md:grid md:grid-cols-2 md:gap-8 md:items-start">
        {/* Left: main weather card */}
        <div className="bg-white/10 rounded-3xl p-6 mb-8 md:mb-0 h-64">
          <div className="h-16 w-28 bg-white/20 rounded-xl mb-4" />
          <div className="h-6 w-20 bg-white/15 rounded mb-6" />
          <div className="flex gap-4">
            <div className="h-5 w-16 bg-white/10 rounded" />
            <div className="h-5 w-16 bg-white/10 rounded" />
            <div className="h-5 w-16 bg-white/10 rounded" />
          </div>
        </div>

        {/* Right: tabs + forecast + stats */}
        <div>
          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 h-10 bg-white/10 rounded-full" />
            <div className="flex-1 h-10 bg-white/10 rounded-full" />
          </div>
          {/* Chart placeholder */}
          <div className="h-32 bg-white/10 rounded-2xl mb-4" />
          {/* Hourly cards */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white/10 rounded-2xl p-4 h-24" />
            ))}
          </div>
          {/* Additional info */}
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white/10 rounded-2xl p-4 h-20" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
