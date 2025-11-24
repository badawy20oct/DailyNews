import News from "@/components/Post";
import Link from "next/link";
import React from "react";
import { authOptions } from "../../lib/nextAuth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { TPost } from "../types/index";

const getPostsByEmail = async (email: string) => {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/authors/${email}`);

    if (res.ok) {
      const { posts } = await res.json();
      return posts;
    }
  } catch (error) {
    return null;
  }
  return null;
};

async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  let posts = [];

  if (!session) {
    redirect("/sign-in");
  }

  if (email) {
    posts = await getPostsByEmail(email);
  }

  return (
    <div className="w-full">
      <div className="flex justify-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl p-2 sm:p-4 text-center text-blue-950">
          Published
        </h1>
      </div>
      <div>
        {posts && posts.length > 0 ? (
          posts.map((news: TPost) => (
            <News
              key={news.id}
              id={news.id}
              date={news.createDate}
              author={""}
              authorEmail={news.authorEmail}
              category={news.categoryName}
              title={news.title}
              link={news.links || []}
              content={news.content}
              thumbnail={news.imageURL}
            />
          ))
        ) : (
          <div className="font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl flex flex-col justify-center items-center py-16 sm:py-24 md:py-36 text-blue-950 text-center px-4">
            <p className="mb-6 sm:mb-8">No News Published</p>
            <Link
              className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl my-4 sm:my-6 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-slate-200 hover:bg-slate-300 underline transition-colors min-h-[44px] flex items-center justify-center"
              href={`/publish-news`}
            >
              Create New
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
