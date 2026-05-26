export type SignUpInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  emailRedirectTo: string;
  marketingConsent?: boolean;
};

export type SignUpResult =
  | { status: "created" }
  | { status: "existing_email" }
  | { status: "confirm_email"; email: string };
