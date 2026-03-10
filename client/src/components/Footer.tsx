import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-12 py-8 text-center text-primary/60 text-sm font-medium">
      <div className="flex items-center justify-center gap-1.5">
        <span>Made with</span>
        <Heart className="w-4 h-4 fill-primary text-primary animate-pulse" />
        <span>for dog lovers everywhere</span>
      </div>
    </footer>
  );
}
