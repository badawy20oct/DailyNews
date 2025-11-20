import { TPost } from "@/app/types";
import EditPostForm from "@/components/EditPostForm";
import { authOptions } from "@/lib/nextAuth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import React from "react";

const getPosts = async (id: string): Promise<TPost | null> => {
  const cookieStore = await cookies(); // ✅ Await cookies()
  const cookieHeader = cookieStore
    .getAll()
    .map(c => `${c.name}=${c.value}`)
    .join("; "); // ✅ Convert cookies to header string

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/posts/${id}`, {
    cache: "no-store",
    headers: {
      Cookie: cookieHeader, // ✅ Correctly pass cookies
    },
  });

  if (!res.ok) return null;
  return res.json();
};

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // ✅ Await params

  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/sign-in");
  }

  const post = await getPosts(id);

  return <>{post ? <EditPostForm post={post} /> : <div>Invalid Post</div>}</>;
}
