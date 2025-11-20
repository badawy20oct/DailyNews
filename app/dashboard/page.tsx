import News from "@/components/Post";
import { NewsData } from "@/data";
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
    <div>
      <div className="relateive flex justify-center">
        <h1 className="font-bold text-4xl p-2 text-center text-blue-950">
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
          <div className="font-extrabold  text-6xl flex flex-col justify-center items-center py-36 text-blue-950">
            No News Published
            <Link
              className="font-bold text-4xl my-6 p-4 rounded-2xl bg-slate-200  underline "
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
