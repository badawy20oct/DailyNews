import { NextResponse } from "next/server";
import { NextAuthProvider } from "@/components/Providres";
import { prisma } from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";

export async function POST(req: Request) {

  
  
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({error : "Note Authenticated   "} , {status:401})
  }

  const { title, content, links, selectedCategory, categoryName, imageURL, publicID } =
    await req.json();

  const authorEmail = session?.user?.email as string;
  const finalCategoryName = categoryName || selectedCategory;

  if (!title || !content) {
    return NextResponse.json(
      { error: "title and content are reuqired" },
      { status: 500 }
    );
  }

  try {
    // Ensure category exists before creating post
    if (finalCategoryName) {
      await prisma.category.upsert({
        where: { categoryName: finalCategoryName },
        update: {},
        create: { categoryName: finalCategoryName },
      });
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        links,
        imageURL,
        publicID,
        categoryName: finalCategoryName,
        authorEmail,
      },
    });
    console.log("post created");
    return NextResponse.json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ message: "couldn't created a post" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: { author: { select: { name: true } } },
      orderBy: {
        createDate: "desc",
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

