import { User, Sparkles, BarChart3, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

interface HeaderProps {
  userName?: string;
}

export function Header({ userName = "Dreamer" }: HeaderProps) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="w-full bg-gradient-to-r from-dreamblush to-dreampeach px-6 py-4 shadow-lg border-b border-dreampink/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="bg-dreamlavender/20 p-2 rounded-full">
              <Sparkles className="w-6 h-6 text-dreamlavender" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-dreamlavender to-primary bg-clip-text text-transparent">
              DreamDash
            </h1>
          </Link>

          {/* Desktop Navigation and User Section */}
          <div className="hidden md:flex items-center gap-6">
            {/* Navigation */}
            <nav className="flex items-center gap-4">
              <Link
                to="/"
                className={`px-4 py-2 rounded-xl transition-all duration-200 ${
                  location.pathname === '/'
                    ? 'bg-dreamlavender/20 text-dreamlavender font-medium'
                    : 'text-foreground/70 hover:text-dreamlavender hover:bg-dreamlavender/10'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/history"
                className={`px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 ${
                  location.pathname === '/history'
                    ? 'bg-dreamlavender/20 text-dreamlavender font-medium'
                    : 'text-foreground/70 hover:text-dreamlavender hover:bg-dreamlavender/10'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                History
              </Link>
            </nav>

            {/* User Avatar and Greeting */}
            <div className="flex items-center gap-3">
              <span className="text-lg font-medium text-foreground/80 hidden lg:block">
                Hi, {userName}!
              </span>
              <div className="bg-white/80 backdrop-blur-sm p-2 rounded-full border border-dreampink/30 shadow-sm">
                <User className="w-6 h-6 text-dreamlavender" />
              </div>
            </div>
          </div>

          {/* Mobile User and Menu */}
          <div className="md:hidden flex items-center gap-3">
            <span className="text-sm font-medium text-foreground/80 hidden xs:block">
              Hi, {userName}!
            </span>
            <div className="bg-white/80 backdrop-blur-sm p-2 rounded-full border border-dreampink/30 shadow-sm">
              <User className="w-5 h-5 text-dreamlavender" />
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-dreamlavender hover:bg-dreamlavender/10 rounded-full transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-r from-dreamblush to-dreampeach border-b border-dreampink/20 shadow-lg animate-slide-in-from-top">
          <nav className="max-w-7xl mx-auto px-6 py-4 space-y-2">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-xl transition-all duration-200 ${
                location.pathname === '/'
                  ? 'bg-dreamlavender/20 text-dreamlavender font-medium'
                  : 'text-foreground/70 hover:text-dreamlavender hover:bg-dreamlavender/10'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/history"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-xl transition-all duration-200 ${
                location.pathname === '/history'
                  ? 'bg-dreamlavender/20 text-dreamlavender font-medium'
                  : 'text-foreground/70 hover:text-dreamlavender hover:bg-dreamlavender/10'
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                History & Statistics
              </div>
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
