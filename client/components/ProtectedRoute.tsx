import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/lib/user-data-utils";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/');
    }
  }, [navigate]);

  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
