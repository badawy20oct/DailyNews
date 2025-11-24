import { TPost } from "@/app/types/index";
import Post from "@/components/Post";

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
      {posts && posts.length > 0 ? (
        posts.map((news: TPost) => (
          <Post
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
