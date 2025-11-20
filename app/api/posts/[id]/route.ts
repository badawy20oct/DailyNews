import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";

// ✅ GET: Get the post by ID, including author
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; // must await in Next.js 15+
  
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not Authenticated" }, { status: 401 });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: { author: true }, // ensure author object is included
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// ✅ PUT: Update the post
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not Authenticated" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, content, links, imageURL, publicID, categoryName, authorEmail } = body;

    // Ensure category exists before updating post
    if (categoryName) {
      await prisma.category.upsert({
        where: { categoryName },
        update: {},
        create: { categoryName },
      });
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: { title, content, links, imageURL, publicID, categoryName, authorEmail },
      include: { author: true },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// ✅ DELETE: Delete the post
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not Authenticated" }, { status: 401 });
  }

  try {
    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
