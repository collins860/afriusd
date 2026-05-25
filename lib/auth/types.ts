export type SignUpInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  emailRedirectTo: string;
  marketingConsent?: boolean;
};

export type SignUpResult = {
  status: "created" | "confirm_email" | "existing_email";
};
