import { TPost } from "@/app/types";
import CategoriesList from "@/components/CategoriesList";
import News from "@/components/Post";
import React from "react";

const getPosts = async (categoryName: string): Promise<TPost[] | null> => {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/api/categories/${categoryName}`,
      { cache: "no-store" }
    );
    if (res.ok) {
      const categories = await res.json();
      const posts = categories.posts;
      return posts;
    }
  } catch (error) {
    console.log(error);
  }
  return null;
};

async function CategoryPosts({ params }: { params: Promise<{ categoryName: string }> }) {
  const { categoryName } = await params;
  const posts = await getPosts(categoryName);

  return (
    <>
      <div className="mb-4 sm:mb-6 md:mb-8">
        <h1 className="font-bold text-lg sm:text-xl md:text-2xl">
          <span className="font-normal">Category: </span>
          <span className="inline-block py-2 sm:py-2.5 px-3 sm:px-4 md:px-6 bg-slate-800 rounded-xl sm:rounded-2xl text-base sm:text-lg md:text-xl lg:text-2xl text-white font-bold mt-2 sm:mt-3">
            {decodeURIComponent(categoryName)}
          </span>
        </h1>
      </div>
      {posts && posts.length > 0 ? (
        posts.map((news: TPost) => (
          <News
            key={news.id}
            id={news.id}
            date={news.createDate}
            author={news.author.name}
            authorEmail={news.authorEmail}
            category={news.categoryName}
            title={news.title}
            link={news.links || []}
            content={news.content}
            thumbnail={news.imageURL}
          />
        ))
      ) : (
        <div className="font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl flex flex-row justify-center items-center py-16 sm:py-24 md:py-36 text-blue-950 text-center px-4">
          No News to Display
        </div>
      )}
    </>
  );
}

export default CategoryPosts;
