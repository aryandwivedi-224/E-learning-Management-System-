import { Loader2 } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="relative">
        {/* Outer spinning ring */}
        <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-[spin_3s_linear_infinite]" />
        {/* Inner spinning ring */}
        <div className="absolute inset-2 rounded-full border-4 border-primary/40 animate-[spin_2s_linear_infinite_reverse]" />
        {/* Center spinner */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
      {/* Loading text with animation */}
      <div className="mt-4 text-lg font-medium text-primary animate-pulse">
        Loading...
      </div>
      {/* Subtle dots animation */}
      <div className="flex gap-1 mt-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingSpinner;