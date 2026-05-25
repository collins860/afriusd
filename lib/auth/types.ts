export type SignUpInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  emailRedirectTo: string;
  marketingConsent?: boolean;
};
