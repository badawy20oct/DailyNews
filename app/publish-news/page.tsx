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
    <div className="w-full">
      <h1 className="py-4 sm:py-6 md:py-8 font-extrabold text-2xl sm:text-3xl md:text-4xl text-blue-950 text-center">
        Publish News
      </h1>
      <CreatePostForm />
    </div>
  );
}

export default PublishNewsPage;
