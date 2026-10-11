export function LoadingSpinner({ size = "md", color = "#1FA7BB" }: { size?: "sm" | "md" | "lg"; color?: string }) {
  const sizeMap = {
    sm: 18,
    md: 28,
    lg: 42,
  };
  const dimension = sizeMap[size];

  return (
    <div
      style={{
        width: dimension,
        height: dimension,
        border: "2px solid rgba(255, 255, 255, 0.08)",
        borderTopColor: color,
        borderRadius: "50%",
      }}
      className="animate-spin"
    />
  );
}

export function LoadingPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "#080808" }}
    >
      {/* Ambient background glow — matching Layer's cyan/teal palette */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div
          className="w-[500px] h-[500px] rounded-full blur-[120px] opacity-25"
          style={{ background: "radial-gradient(circle, #1FA7BB 0%, #174F49 60%, transparent 100%)" }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* Layer Logo Card with subtle pulse & glow */}
        <div className="relative mb-6">
          <div
            className="absolute -inset-2 rounded-2xl blur-md opacity-30 animate-pulse"
            style={{ background: "#1FA7BB" }}
          />
          <div
            className="relative w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden transition-all duration-300"
            style={{
              background: "#121315",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "0 8px 32px -8px rgba(0, 0, 0, 0.8)",
            }}
          >
            <img
              src="/logo.png"
              alt="Layer"
              className="w-10 h-10 object-contain drop-shadow"
            />
          </div>
        </div>

        {/* Minimal circular spinner */}
        <div className="relative mb-5 flex items-center justify-center">
          <div
            className="w-7 h-7 rounded-full border-2 animate-spin"
            style={{
              borderColor: "rgba(31, 167, 187, 0.15)",
              borderTopColor: "#1FA7BB",
            }}
          />
        </div>

        {/* Brand Text */}
        <h2
          className="text-base font-semibold tracking-tight mb-1"
          style={{ color: "#F5F4F5" }}
        >
          Loading Layer
        </h2>
        <p
          className="text-xs mb-4"
          style={{ color: "#A8A9A2" }}
        >
          Getting things ready
        </p>

        {/* Subtle bouncing teal dots */}
        <div className="flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full animate-bounce"
            style={{ background: "#1FA7BB", animationDelay: "0ms" }}
          />
          <span
            className="w-1.5 h-1.5 rounded-full animate-bounce"
            style={{ background: "#1FA7BB", animationDelay: "150ms" }}
          />
          <span
            className="w-1.5 h-1.5 rounded-full animate-bounce"
            style={{ background: "#1FA7BB", animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}

export function LoadingCard() {
  return (
    <div
      className="rounded-2xl p-6 animate-pulse"
      style={{
        background: "#121315",
        border: "1px solid rgba(255, 255, 255, 0.06)",
      }}
    >
      <div
        className="h-5 rounded-lg w-1/3 mb-4"
        style={{ background: "rgba(255, 255, 255, 0.06)" }}
      />
      <div className="space-y-2.5">
        <div
          className="h-3.5 rounded-md w-full"
          style={{ background: "rgba(255, 255, 255, 0.04)" }}
        />
        <div
          className="h-3.5 rounded-md w-5/6"
          style={{ background: "rgba(255, 255, 255, 0.04)" }}
        />
        <div
          className="h-3.5 rounded-md w-4/6"
          style={{ background: "rgba(255, 255, 255, 0.04)" }}
        />
      </div>
    </div>
  );
}
