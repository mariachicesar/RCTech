import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Sign In | RC Tech Bridge - Admin Dashboard",
  description: "Sign in to RC Tech Bridge admin dashboard to manage your business technology solutions",
};

export default function SignIn() {
  return <SignInForm />;
}
