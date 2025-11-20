import CategoriesList from "@/components/CategoriesList";
import News from "@/components/Post";
import { TPost } from "@/app/types/index";

const getPosts = async (): Promise<TPost[] | null> => {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/posts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // ensure fresh data in Next.js app router
    });

    if (res.ok) {
      const posts = await res.json();
      return posts;
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
  return null;
};
export default async function Home() {
  const posts = await getPosts();
  return (
    <>
      <CategoriesList />
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
