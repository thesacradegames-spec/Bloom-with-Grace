import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, loadUserDisplayName } from "@/lib/user-data-utils";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkUser = () => {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        navigate('/');
      } else {
        // Verify user has complete profile data
        const displayName = loadUserDisplayName(currentUser);
        if (!displayName || displayName === currentUser) {
          // User exists but may not have complete profile, let them through
          // The dashboard will handle any missing data gracefully
        }
      }
      setIsChecking(false);
    };

    checkUser();
  }, [navigate]);

  const currentUser = getCurrentUser();

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-pink-500 to-purple-600 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-medium">Loading your garden... 🌸</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
