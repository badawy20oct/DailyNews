import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

export async function GET(
  req: Request,
  context: { params: Promise<{ categoryName: string }> }
) {
  try {
    const { categoryName } = await context.params;
    const category = await prisma.category.findUnique({
      where: { categoryName },
      include: {
        posts: {
          include: { author: true },
          orderBy: { createDate: "desc" }, // newest first
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // ✅ Flatten categoryName into each post
    const postsWithCategoryName = category.posts.map((post) => ({
      ...post,
      categoryName: category.categoryName,
    }));

    return NextResponse.json({
      ...category,
      posts: postsWithCategoryName,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
