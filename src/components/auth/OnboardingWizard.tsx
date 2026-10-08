import React from 'react';
import { UserProfile, AuthUser } from '../../types';
import { OnboardingFlow } from '../onboarding/OnboardingFlow';

export interface OnboardingWizardProps {
  initialProfile: UserProfile;
  initialAuthUser?: AuthUser | null;
  onComplete: (updatedProfile: UserProfile) => void;
  onClose?: () => void;
  onOpenSignIn?: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  initialProfile,
  initialAuthUser,
  onComplete,
  onOpenSignIn
}) => {
  return (
    <OnboardingFlow
      initialProfile={initialProfile}
      authUser={initialAuthUser || null}
      onComplete={onComplete}
      onOpenSignIn={onOpenSignIn}
    />
  );
};
