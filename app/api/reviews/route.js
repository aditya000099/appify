import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { rating, comment, appId } = await request.json();

    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        userId: session.user.id,
        appId,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating review" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const appId = searchParams.get("appId");

  if (!appId) {
    return NextResponse.json({ message: "App ID required" }, { status: 400 });
  }

  try {
    const reviews = await prisma.review.findMany({
      where: { appId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching reviews" },
      { status: 500 }
    );
  }
}
