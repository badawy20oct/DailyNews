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
      <h1 className="font-bold mt-3">
        <span className="font-normal text-xl ">Category : </span>{" "}
        <span className="py-2 px-4 bg-slate-800 rounded-2xl text-xl text-white font-bold">{decodeURIComponent(categoryName)}</span>
      </h1>
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
        <div className="font-extrabold  text-6xl flex flex-row justify-center py-36 ">
          No News to Display
        </div>
      )}
    </>
  );
}

export default CategoryPosts;
