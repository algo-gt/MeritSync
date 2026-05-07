export type UserRole = "TALENT" | "EMPLOYER";
export type OnboardingStatus = "INCOMPLETE" | "COMPLETE";

export interface UserProfile {
  id: string;
  email: string;
  user_role: UserRole | null;
  onboarding_status: OnboardingStatus;
  has_accepted_dpdp: boolean;
  provider_token?: string | null;
}
