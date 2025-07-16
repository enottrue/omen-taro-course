# Onboarding Configuration

## Overview

The onboarding functionality can now be controlled via environment variable, allowing you to enable or disable the onboarding flow without code changes.

## Environment Variable

### NEXT_PUBLIC_ONBOARDING

**Type:** `string`  
**Values:** `TRUE` | `FALSE` (case-insensitive)  
**Default:** `TRUE` (if not set)

### Usage

Add this variable to your `.env` or `.env.local` file:

```bash
# Enable onboarding (default behavior)
NEXT_PUBLIC_ONBOARDING=TRUE

# Disable onboarding (skip onboarding, go directly to courses)
NEXT_PUBLIC_ONBOARDING=FALSE
```

## Behavior

### When ONBOARDING=TRUE (Default)
- Users will see the onboarding flow after registration/login
- Onboarding status is tracked in localStorage
- Users can skip or complete onboarding
- After onboarding, users are redirected to `/courses`

### When ONBOARDING=FALSE
- Onboarding flow is completely skipped
- All users are redirected directly to `/courses` after authentication
- localStorage onboarding status is ignored
- No onboarding-related UI is shown

## Implementation Details

### Utility Functions

The onboarding logic is centralized in `src/utils/onboardingUtils.ts`:

- `isOnboardingEnabled()` - Check if onboarding is enabled via env var
- `getOnboardingRedirectPath(userOnboarded)` - Get appropriate redirect path
- `getOnboardingStatus()` - Get onboarding status from localStorage (respects env var)
- `setOnboardingStatus(status)` - Set onboarding status (only if enabled)

### Updated Components

The following components now use the new onboarding utilities:

- `src/components/modal-form-register/modal-form-register.tsx`
- `src/components/modal-form-auth/modal-form-auth.tsx`
- `src/components/about/About.tsx`
- `src/components/way/Way.tsx`
- `src/components/modal-form/modal-form.tsx`
- `src/components/modal_signin/SignIn.tsx`
- `pages/reset-password.tsx`
- `pages/onboarding.tsx`
- `src/components/onboarding/OnboardingStages.tsx`
- `src/hooks/useLogin.tsx`
- `src/components/LogoutButton.tsx`

## Migration Notes

### For Existing Users
- Existing localStorage onboarding status is preserved
- When ONBOARDING=FALSE, all users skip onboarding regardless of previous status
- When ONBOARDING=TRUE, existing onboarding status is respected

### For New Users
- When ONBOARDING=FALSE, new users go directly to courses
- When ONBOARDING=TRUE, new users see onboarding flow

## Testing

To test the functionality:

1. Set `NEXT_PUBLIC_ONBOARDING=TRUE` and verify onboarding flow works
2. Set `NEXT_PUBLIC_ONBOARDING=FALSE` and verify users go directly to courses
3. Test with both new and existing users
4. Verify logout clears onboarding status appropriately

## Logging

The system provides detailed logging for debugging:

- `🚫 Onboarding disabled via environment variable` - When onboarding is disabled
- `🎯 Onboarding enabled, user onboarded: X, redirecting to: Y` - When onboarding is enabled
- `✅ Onboarding status set to: X` - When onboarding status is updated 