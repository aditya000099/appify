import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all downloads
export async function GET() {
  try {
    const downloads = await prisma.download.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        app: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return NextResponse.json(downloads);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST new download
export async function POST(request) {
  try {
    const { userId, appId } = await request.json();
    const download = await prisma.download.create({
      data: {
        userId,
        appId,
      },
    });
    return NextResponse.json(download);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
