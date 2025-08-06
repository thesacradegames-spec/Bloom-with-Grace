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
      
      <main className="flex flex-col items-center justify-center min-h-[70vh] p-4">
        <div className="text-center animate-fade-in">
          <div className="mb-8">
            <Star className="w-20 h-20 text-dreamlavender/60 mx-auto mb-4 animate-sparkle" />
            <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-foreground/80 mb-2">
              Oops! This dream doesn't exist yet
            </h2>
            <p className="text-lg text-foreground/60 mb-8 max-w-md mx-auto">
              Looks like you've wandered off the path to your dreams. 
              Let's get you back on track! ✨
            </p>
          </div>
          
          <Link to="/">
            <Button className="bg-gradient-to-r from-dreamlavender to-primary hover:from-dreamlavender/90 hover:to-primary/90 text-white px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <Home className="w-5 h-5 mr-2" />
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
