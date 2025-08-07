import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/ui/header";
import { Star, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-dreamblush/30 to-dreampeach/20">
      <Header userName="Dreamer" />

      <main className="flex flex-col items-center justify-center min-h-[70vh] p-4 sm:p-6">
        <div className="text-center animate-fade-in">
          <div className="mb-6 sm:mb-8">
            <Star className="w-16 h-16 sm:w-20 sm:h-20 text-dreamlavender/60 mx-auto mb-3 sm:mb-4 animate-sparkle" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-3 sm:mb-4">404</h1>
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground/80 mb-2">
              Oops! This dream doesn't exist yet
            </h2>
            <p className="text-base sm:text-lg text-foreground/60 mb-6 sm:mb-8 max-w-sm sm:max-w-md mx-auto px-2">
              Looks like you've wandered off the path to your dreams.
              Let's get you back on track! ✨
            </p>
          </div>

          <Link to="/">
            <Button className="bg-gradient-to-r from-dreamlavender to-primary hover:from-dreamlavender/90 hover:to-primary/90 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base">
              <Home className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
