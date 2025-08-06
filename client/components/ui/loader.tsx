import { Heart } from "lucide-react";

export function Loader() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Heart className="w-12 h-12 text-dreamlavender animate-pulse" />
          <Heart className="w-8 h-8 text-dreampink animate-ping absolute top-1 left-1" />
        </div>
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-dreamlavender rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-dreampink rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-dreampeach rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        <p className="text-lg font-medium text-foreground/60 animate-pulse">Loading your dreams...</p>
      </div>
    </div>
  );
}
