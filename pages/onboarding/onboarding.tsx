import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Onboarding = () => {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already onboarded
    const isOnboarded = localStorage.getItem('isOnboarded');

    if (isOnboarded) {
      // Redirect to home page if already onboarded
      router.push('/courses');
    }
  }, []);

  const handleOnboardingComplete = () => {
    // Set onboarding flag in local storage
    localStorage.setItem('isOnboarded', 'true');

    // Redirect to home page
    router.push('/');
  };

  return (
    <div>
      <h1>Welcome to the Onboarding Page!</h1>
      <button onClick={handleOnboardingComplete}>Complete Onboarding</button>
    </div>
  );
};

export default Onboarding;
