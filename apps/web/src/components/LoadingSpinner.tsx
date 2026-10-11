export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div
      className={`${sizeClasses[size]} border-blue-500 border-t-transparent rounded-full animate-spin`}
    />
  );
}

export function LoadingPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="text-center relative z-10">
        {/* Logo with pulse animation */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="w-20 h-20 bg-blue-600 rounded-2xl relative z-10 animate-pulse flex items-center justify-center shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
          </div>
        </div>

        {/* Spinner */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <LoadingSpinner size="lg" />
            {/* Outer ring */}
            <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Loading text with gradient */}
        <h2 className="text-2xl font-bold mb-2">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 animate-gradient">
            Loading...
          </span>
        </h2>
        <p className="text-gray-500 text-sm">
          Getting things ready
        </p>

        {/* Animated dots */}
        <div className="flex justify-center gap-2 mt-6">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-4/6" />
      </div>
    </div>
  );
}
