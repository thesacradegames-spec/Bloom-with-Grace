import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WebappLoader } from "@/components/ui/webapp-loader";
import { SplashScreen } from "@/components/ui/splash-screen";
import { ProfileForm } from "@/components/ui/profile-form";
import { getCurrentUser, initializeNewUser, isCompletelyNewUser, normalizeUsername } from "@/lib/user-data-utils";

type OnboardingStage = 'webapp-loading' | 'splash' | 'profile' | 'complete';

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
    // Normalize the username for consistency
    const normalizedUsername = normalizeUsername(profileData.name);

    if (isCompletelyNewUser(normalizedUsername)) {
      // Initialize as completely new user with fresh data
      initializeNewUser(normalizedUsername, profileData.name, profileData.birthday, profileData.character);
    } else {
      // Existing user - just update current user but keep their progress
      localStorage.setItem('bloom-current-user', normalizedUsername);
      localStorage.setItem(`bloom-user-${normalizedUsername}-display-name`, profileData.name);
      localStorage.setItem(`bloom-user-${normalizedUsername}-birthday`, profileData.birthday);
      localStorage.setItem(`bloom-user-${normalizedUsername}-character`, profileData.character);
    }

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
