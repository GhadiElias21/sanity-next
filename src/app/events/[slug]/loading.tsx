export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white animate-pulse">
      <div className="container mx-auto px-4 py-12">
        {/* Back button skeleton */}
        <div className="w-24 h-8 bg-gray-200 rounded-lg mb-8"></div>
        
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left column */}
          <div className="space-y-6">
            {/* Image skeleton */}
            <div className="relative aspect-video rounded-2xl bg-gray-200 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-shimmer"></div>
            </div>
            
            {/* Description skeleton */}
            <div className="bg-white p-8 rounded-2xl space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>

            {/* Map skeleton */}
            <div className="rounded-xl overflow-hidden">
              <div className="aspect-video bg-gray-200"></div>
              <div className="bg-white p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl space-y-6">
              {/* Title skeleton */}
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>

              {/* Info blocks */}
              <div className="space-y-4">
                <div className="p-4 bg-gray-100 rounded-lg space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="p-4 bg-gray-100 rounded-lg space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="p-4 bg-gray-100 rounded-lg space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>

              {/* Button skeleton */}
              <div className="h-12 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 