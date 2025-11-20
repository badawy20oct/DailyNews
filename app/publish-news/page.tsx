import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/nextAuth";
import { redirect } from "next/navigation";
import CreatePostForm from "@/components/CreatePostForm";

async function PublishNewsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/sign-in");
  }
  return (
    <div>
      <h1 className="py-4 font-extrabold text-3xl text-blue-950  text-center"> publish </h1>
      <CreatePostForm />
    </div>
  );
}

export default PublishNewsPage;
