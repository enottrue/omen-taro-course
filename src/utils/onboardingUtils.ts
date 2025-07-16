/**
 * Utility functions for managing onboarding functionality
 */

/**
 * Check if onboarding is enabled via environment variable
 * @returns boolean - true if onboarding is enabled, false otherwise
 */
export const isOnboardingEnabled = (): boolean => {
  // Check environment variable (case-insensitive)
  const onboardingEnv = process.env.NEXT_PUBLIC_ONBOARDING?.toLowerCase();
  return onboardingEnv === 'true';
};

/**
 * Get the appropriate redirect path based on onboarding status
 * @param userOnboarded - whether the user has completed onboarding
 * @returns string - redirect path
 */
export const getOnboardingRedirectPath = (userOnboarded: boolean): string => {
  // If onboarding is disabled via env, always redirect to courses
  if (!isOnboardingEnabled()) {
    console.log('🚫 Onboarding disabled via environment variable, redirecting to courses');
    return '/courses';
  }

  // If onboarding is enabled, check user status
  const shouldRedirect = userOnboarded ? '/courses' : '/onboarding';
  console.log(`🎯 Onboarding enabled, user onboarded: ${userOnboarded}, redirecting to: ${shouldRedirect}`);
  return shouldRedirect;
};

/**
 * Get onboarding status from localStorage with environment variable check
 * @returns string - 'true', 'false', or null
 */
export const getOnboardingStatus = (): string | null => {
  // If onboarding is disabled, always return 'true' to skip onboarding
  if (!isOnboardingEnabled()) {
    console.log('🚫 Onboarding disabled via environment variable, skipping onboarding check');
    return 'true';
  }

  // If onboarding is enabled, check localStorage
  if (typeof window !== 'undefined') {
    return localStorage.getItem('onboarded');
  }
  
  return null;
};

/**
 * Set onboarding status in localStorage (only if onboarding is enabled)
 * @param status - 'true' or 'false'
 */
export const setOnboardingStatus = (status: 'true' | 'false'): void => {
  // Only set localStorage if onboarding is enabled
  if (isOnboardingEnabled() && typeof window !== 'undefined') {
    localStorage.setItem('onboarded', status);
    console.log(`✅ Onboarding status set to: ${status}`);
  } else {
    console.log('🚫 Onboarding disabled via environment variable, skipping localStorage update');
  }
}; 