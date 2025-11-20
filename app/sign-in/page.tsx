import SignInPage from "@/components/SignInBtn";
import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../../lib/nextAuth";
import { redirect } from "next/navigation";

async function SignIn() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/");
  }

  return (
    <div>
      <SignInPage />
    </div>
  );
}

export default SignIn;
