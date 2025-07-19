import ProfileClient from "@/components/user-profile/ProfileClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js Profile | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Profile page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function Profile() {
  return (
    <div>
      <ProfileClient />
    </div>
  );
}
