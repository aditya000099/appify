import prisma from "@/prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET all apps and analytics
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const apps = await prisma.app.findMany({
      where: {
        developerId: session.user.id,
      },
      include: {
        downloads: true,
        reviews: true,
      },
    });

    const analytics = {
      totalApps: apps.length,
      totalDownloads: apps.reduce((acc, app) => acc + app.downloads.length, 0),
      averageRating:
        apps.reduce((acc, app) => {
          const ratings = app.reviews.map((r) => r.rating);
          return ratings.length
            ? acc + ratings.reduce((a, b) => a + b, 0) / ratings.length
            : acc;
        }, 0) / (apps.length || 1),
    };

    return NextResponse.json({ apps, analytics });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST new app
export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const newApp = await prisma.app.create({
      data: {
        ...data,
        developerId: session.user.id,
      },
    });

    return NextResponse.json(newApp);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
