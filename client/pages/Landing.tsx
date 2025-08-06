import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SplashScreen } from "@/components/ui/splash-screen";
import { ProfileForm } from "@/components/ui/profile-form";
import { getCurrentUser } from "@/lib/user-data-utils";

type OnboardingStage = 'splash' | 'profile' | 'complete';

interface ProfileData {
  name: string;
  birthday: string;
  character: string;
}

export default function Landing() {
  const [stage, setStage] = useState<OnboardingStage>('splash');
  const navigate = useNavigate();

  // Check if user already exists and redirect
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSplashComplete = () => {
    setStage('profile');
  };

  const handleProfileComplete = (profileData: ProfileData) => {
    // Save user data to localStorage
    localStorage.setItem('bloom-current-user', profileData.name);
    localStorage.setItem(`bloom-user-${profileData.name.toLowerCase().replace(/\s+/g, '-')}-birthday`, profileData.birthday);
    localStorage.setItem(`bloom-user-${profileData.name.toLowerCase().replace(/\s+/g, '-')}-display-name`, profileData.name);
    localStorage.setItem(`bloom-user-${profileData.name.toLowerCase().replace(/\s+/g, '-')}-character`, profileData.character);

    setStage('complete');

    // Navigate to dashboard after brief delay
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  // Render based on current stage
  if (stage === 'splash') {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (stage === 'profile') {
    return <ProfileForm onComplete={handleProfileComplete} />;
  }

  // Complete stage - show loading before navigation
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-pink-500 to-purple-600 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xl font-medium">Welcome to your garden! 🌸</p>
      </div>
    </div>
  );
}
