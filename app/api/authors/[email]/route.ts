import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

export async function GET(
  req: Request,
  context: { params: Promise<{ email: string }> }
) {
  try {
    const { email } = await context.params; 

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        posts: {
          orderBy: { createDate: "desc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
